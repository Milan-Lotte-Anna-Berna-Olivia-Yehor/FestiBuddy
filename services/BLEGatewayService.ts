import { PermissionsAndroid, Platform } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { sharedBleManager } from './BleManager';

// Tvoje UUID
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

class BLEGatewayService {
  connectedDevices: Device[] = [];
  isScanning = false;

  // --- BEZPEČNÉ POVOLENIA (ANTI-CRASH) ---
  async requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        // Zistíme verziu Androidu
        const apiLevel = Platform.Version;

        if (typeof apiLevel === 'number' && apiLevel >= 31) {
          // Android 12+ (Nový systém)
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Niektoré telefóny to stále vyžadujú
          ]);

          return (
            result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          // Android 11 a starší (Starý systém)
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  // --- START GATEWAY ---
  async startGateway(onDeviceCountChange: (count: number) => void) {
    if (this.isScanning) return;

    // 1. Najprv povolenia
    const hasPerms = await this.requestPermissions();
    if (!hasPerms) {
      console.log("❌ CRITICAL: Permissions denied! Cannot scan.");
      return;
    }

    console.log("🚀 Starting Gateway Mode (Filtered Scan)...");
    this.isScanning = true;

    // Pre istotu zastavíme predošlé
    sharedBleManager.stopDeviceScan();

    // 2. Skenujeme LEN naše zariadenia (podľa SERVICE_UUID)
    // Týmto zabránime pádom pri nájdení cudzích zariadení bez mena
    sharedBleManager.startDeviceScan(
      [SERVICE_UUID], // <--- KĽÚČOVÁ ZMENA: Hľadáme len naše UUID
      { allowDuplicates: true }, // Dovolíme opakované nálezy pre lepší signál
      (error, device) => {
        if (error) {
          // Ignorujeme chybu 600 (Scan in progress)
          if (error.errorCode !== 600) {
              console.log("Scan Error:", error);
              this.isScanning = false;
          }
          return;
        }

        // Ak sme našli zariadenie s naším Service UUID
        if (device) {
          this.handleFoundDevice(device, onDeviceCountChange);
        }
      }
    );
  }

  // --- PRIPOJENIE ---
  private async handleFoundDevice(device: Device, callback: (c: number) => void) {
    // Skontrolujeme duplicitu v našom zozname
    const alreadyConnected = this.connectedDevices.some(d => d.id === device.id);
    if (alreadyConnected) return;

    console.log(`🔎 Gateway found target: ${device.id}. Attempting link...`);

    try {
      // Pokus o pripojenie
      const connectedDevice = await device.connect();
      const readyDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      
      // Double check po pripojení
      if (!this.connectedDevices.some(d => d.id === readyDevice.id)) {
          console.log(`✅ Linked node: ${readyDevice.id}`);
          this.connectedDevices.push(readyDevice);
          callback(this.connectedDevices.length);
          
          // Signalizácia (Bliknutie)
          this.writeToDevice(readyDevice, "C");
      }
    } catch (error) {
      // Tu zachytíme chybu pripojenia, aby appka nepadla
      console.log(`⚠️ Connection failed to ${device.id}`, error);
    }
  }

  stopGateway() {
    console.log("🛑 Stopping Gateway...");
    this.isScanning = false;
    sharedBleManager.stopDeviceScan();
    this.connectedDevices.forEach(d => d.cancelConnection().catch(() => {}));
    this.connectedDevices = [];
  }

  // --- OVLÁDANIE ---
  async broadcastCommand(command: string) {
    const base64Cmd = this.stringToBase64(command);
    const promises = this.connectedDevices.map(device => 
        device.writeCharacteristicWithResponseForService(
            SERVICE_UUID, CHAR_UUID, base64Cmd
        ).catch(e => console.warn(`Tx Fail ${device.id}`))
    );
    await Promise.all(promises);
  }

  private async writeToDevice(device: Device, command: string) {
      const base64 = this.stringToBase64(command);
      try {
          await device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, base64);
      } catch (e) {}
  }

  private stringToBase64(str: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (let i = 0; i < str.length; i += 3) {
        const val = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
        output += chars.charAt((val >> 18) & 63) + chars.charAt((val >> 12) & 63) + chars.charAt((val >> 6) & 63) + chars.charAt(val & 63);
    }
    return output;
  }
}

export const gatewayService = new BLEGatewayService();