import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { isBleReady, sharedBleManager } from './BleManager';

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

class BLEService {
  connectedDevice: Device | null = null;

  constructor() {}

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  }

  async scanAndConnect(onConnected: () => void, onError: (error: string) => void) {
    console.log("Starting Scan (User Mode)...");

    const ready = await isBleReady();
    if (!ready) {
      onError("Bluetooth is OFF");
      return;
    }

    const hasPerms = await this.requestPermissions();
    if (!hasPerms) {
      onError("Permissions denied");
      return;
    }
    
    sharedBleManager.stopDeviceScan(); 
    
    sharedBleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        if (error.errorCode !== 600) onError(error.message);
        return;
      }

      // Hľadáme FestiBuddy_Node
      if (device && (device.name === 'FestiBuddy_Node' || device.localName === 'FestiBuddy_Node')) {
        console.log("Found Device:", device.name);
        sharedBleManager.stopDeviceScan(); 
        
        device.connect({ timeout: 5000 })
          .then(async (d) => {
             await new Promise(r => setTimeout(r, 500));
             return d.discoverAllServicesAndCharacteristics();
          })
          .then(async (readyDevice) => {
            this.connectedDevice = readyDevice;
            await AsyncStorage.setItem("isBraceletPaired", "true");
            await this.sendCommand("C"); // Pípne na zeleno
            onConnected();
          })
          .catch((error) => {
            console.log("Connection failed", error);
            onError("Connection failed: " + error.message);
          });
      }
    });

    setTimeout(() => {
        sharedBleManager.stopDeviceScan();
    }, 10000);
  }

  async sendCommand(command: string) {
    if (!this.connectedDevice) return;
    
    let base64Cmd = "";
    
    // --- TU BOL PROBLÉM, PRIDAL SOM CHÝBAJÚCE PRÍKAZY ---
    if (command === "S") base64Cmd = "Uw==";       // SOS (Start)
    else if (command === "0") base64Cmd = "MA==";  // OFF (Stop) - Kľúčová oprava!
    else if (command === "T") base64Cmd = "VA==";  // Test (Rainbow)
    else if (command === "C") base64Cmd = "Qw==";  // Connect (Green)
    else if (command === "1") base64Cmd = "MQ==";  // Blue Test (Backup)
    
    if (!base64Cmd) {
        console.warn("Neznámy príkaz:", command);
        return;
    }

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID, CHAR_UUID, base64Cmd
      );
      console.log(`Command '${command}' sent.`);
    } catch (e) { console.log("Send Error", e); }
  }

  async disconnect() {
    if (this.connectedDevice) {
        try { await this.connectedDevice.cancelConnection(); } catch(e) {}
        this.connectedDevice = null;
        await AsyncStorage.setItem("isBraceletPaired", "false");
    }
  }
}

export const bleService = new BLEService();