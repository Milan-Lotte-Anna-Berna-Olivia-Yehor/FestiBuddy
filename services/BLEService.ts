import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

// UUIDs musia sedieť s tým, čo máš v ESP32 kóde
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

class BLEService {
  manager: BleManager;
  connectedDevice: Device | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  // Helper na prevod príkazu do Base64 (nutné pre BLE)
  private stringToBase64(str: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (let i = 0; i < str.length; i += 3) {
        const val = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
        output += chars.charAt((val >> 18) & 63) + chars.charAt((val >> 12) & 63) + chars.charAt((val >> 6) & 63) + chars.charAt(val & 63);
    }
    return output;
  }

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
    console.log("Starting Scan...");
    
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan Error:", error);
        onError(error.message);
        return;
      }

      // Hľadáme zariadenie s názvom "FestiBuddy_Node"
      if (device && (device.name === 'FestiBuddy_Node' || device.localName === 'FestiBuddy_Node')) {
        console.log("Found Device:", device.name);
        this.manager.stopDeviceScan();
        
        device.connect()
          .then((device) => {
            console.log("Connected. Discovering services...");
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(async (device) => {
            this.connectedDevice = device;
            console.log("Services Discovered!");
            
            // Uložíme status, že sme spárovaní
            await AsyncStorage.setItem("isBraceletPaired", "true");
            
            // Pošleme príkaz "C" (Connect) pre zelené bliknutie
            this.sendCommand("C");
            
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
        this.manager.stopDeviceScan();
    }, 10000);
  }

  async sendCommand(command: string) {
    if (!this.connectedDevice) return;

    // React Native BLE PLX potrebuje Base64
    // Pre jednoduchosť posielame 1 znak, Base64 z 'S' je 'Uw==' atď.
    // Tu používame jednoduchý prevod, ale v reále môžeš použiť knižnicu 'buffer'
    let base64Cmd = "";
    if (command === "S") base64Cmd = "Uw=="; // SOS
    if (command === "C") base64Cmd = "Qw=="; // Connect
    if (command === "1") base64Cmd = "MQ=="; // Color 1

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHAR_UUID,
        base64Cmd
      );
      console.log(`Command ${command} sent!`);
    } catch (e) {
      console.log("Send Error", e);
    }
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