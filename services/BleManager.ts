import { BleManager } from 'react-native-ble-plx';

let bleManagerInstance: BleManager | null = null;

export const getBleManager = () => {
  if (!bleManagerInstance) {
    try {
      // Pokúsime sa načítať skutočný Bluetooth Manager
      bleManagerInstance = new BleManager();
    } catch (error) {
      console.warn("⚠️ WARNING: Bluetooth Native Module not found!");
      console.warn("👉 You are likely running in Expo Go. Real Bluetooth requires a Development Build.");
      console.warn("👉 Running in MOCK MODE to prevent crash.");

      // Vytvoríme Falošný (Mock) Manager, aby appka nespadla
      bleManagerInstance = {
        state: () => Promise.resolve('PoweredOn'),
        startDeviceScan: (uuids: any, options: any, listener: any) => {
          console.log("[MOCK] Scanning for devices...");
          // Simulácia: Po 2 sekundách "nájde" náš náramok
          setTimeout(() => {
            if (listener) {
              listener(null, {
                id: 'MOCK_DEVICE_01',
                name: 'FestiBuddy_Node',
                localName: 'FestiBuddy_Node',
                connect: () => Promise.resolve({
                  discoverAllServicesAndCharacteristics: () => Promise.resolve({
                    id: 'MOCK_DEVICE_01',
                    writeCharacteristicWithResponseForService: async (s: string, c: string, val: string) => {
                      console.log(`[MOCK] Writing Command: ${val}`);
                      return true;
                    }
                  })
                })
              });
            }
          }, 2000);
        },
        stopDeviceScan: () => console.log("[MOCK] Scan stopped"),
        destroy: () => {},
        // Pridaj ďalšie metódy ak by kričalo, že chýbajú
      } as unknown as BleManager;
    }
  }
  return bleManagerInstance;
};

// HELPER: Bezpečné overenie, či je Bluetooth zapnutý
export const isBleReady = async (): Promise<boolean> => {
  try {
    const manager = getBleManager();
    const state = await manager.state();
    return state === 'PoweredOn';
  } catch (e) {
    return false;
  }
};

export const sharedBleManager = getBleManager();