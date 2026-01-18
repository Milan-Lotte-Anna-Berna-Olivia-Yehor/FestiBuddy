import { BleManager } from 'react-native-ble-plx';

let bleManagerInstance: BleManager | null = null;

export const getBleManager = () => {
  if (!bleManagerInstance) {
    bleManagerInstance = new BleManager();
  }
  return bleManagerInstance;
};

// Exportujeme priamo inštanciu pre jednoduchšie použitie, ale cez funkciu je to bezpečnejšie
export const sharedBleManager = getBleManager();