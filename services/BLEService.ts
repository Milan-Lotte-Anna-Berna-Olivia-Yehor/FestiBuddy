import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { sharedBleManager } from './BleManager'; // <--- IMPORT SPOLOČNÉHO

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

class BLEService {
  connectedDevice: Device | null = null;

  // Konštruktor je teraz prázdny, manager už existuje
  constructor() {}

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return granted;
    }
    return true;
  }

  scanAndConnect(onConnected: () => void, onError: (error: string) => void) {
    console.log("Starting Scan (User Mode)...");
    
    // Používame sharedBleManager
    sharedBleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan Error:", error);
        onError(error.message);
        return;
      }

      if (device && (device.name === 'FestiBuddy_Node' || device.localName === 'FestiBuddy_Node')) {
        console.log("Found Device:", device.name);
        
        // Zastavíme skenovanie, lebo sme našli naše zariadenie
        sharedBleManager.stopDeviceScan(); 
        
        device.connect()
          .then((device) => {
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(async (device) => {
            this.connectedDevice = device;
            await AsyncStorage.setItem("isBraceletPaired", "true");
            this.sendCommand("C"); // Potvrdenie (Zelená)
            onConnected();
          })
          .catch((error) => {
            console.log("Connection failed", error);
            onError(error.message);
          });
      }
    });

    // Timeout po 10 sekundách
    setTimeout(() => {
        sharedBleManager.stopDeviceScan();
    }, 10000);
  }

  async sendCommand(command: string) {
    if (!this.connectedDevice) return;
    
    let base64Cmd = "";
    if (command === "S") base64Cmd = "Uw==";
    if (command === "C") base64Cmd = "Qw=="; 
    if (command === "1") base64Cmd = "MQ=="; 
    if (command === "0") base64Cmd = "MA==";

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID, CHAR_UUID, base64Cmd
      );
    } catch (e) { console.log("Send Error", e); }
  }

  async disconnect() {
    if (this.connectedDevice) {
        await this.connectedDevice.cancelConnection();
        this.connectedDevice = null;
        await AsyncStorage.setItem("isBraceletPaired", "false");
    }
  }
}

export const bleService = new BLEService();