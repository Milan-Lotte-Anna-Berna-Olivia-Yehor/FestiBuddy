import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function PairBracelet() {
  const router = useRouter();

  // Simulated BLE states
  const [pairingStatus, setPairingStatus] = useState('disconnected'); // 'scanning' | 'paired'
  const [autoReconnectMsg, setAutoReconnectMsg] = useState('');
  const [devices, setDevices] = useState([
    { id: 'esp32_01', name: 'ESP32 Bracelet 01' },
    { id: 'esp32_02', name: 'ESP32 Bracelet 02' },
  ]);

  // Simulate scanning and pairing
  const startScan = () => {
    setPairingStatus('scanning');
    setAutoReconnectMsg('');
    setTimeout(() => {
      setPairingStatus('paired');
    }, 2000); // simulate 2s scanning
  };

  // Simulate reset / new pairing
  const resetPairing = () => {
    setPairingStatus('disconnected');
    setAutoReconnectMsg('Old bonds cleared, scanning for new devices...');
    setTimeout(() => {
      startScan();
    }, 1500);
  };

  // Simulate auto-reconnect when "device powers up"
  useEffect(() => {
    if (pairingStatus === 'disconnected') {
      // Auto reconnect after 3s
      const timer = setTimeout(() => {
        setPairingStatus('paired');
        setAutoReconnectMsg('Device reconnected automatically');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pairingStatus]);

  // Render BLE status with color
  const renderStatus = () => {
    let color = '#f00';
    if (pairingStatus === 'scanning') color = '#ff0';
    if (pairingStatus === 'paired') color = '#0f0';

    return (
      <Text style={[styles.status, { color }]}>
        {pairingStatus.charAt(0).toUpperCase() + pairingStatus.slice(1)}
      </Text>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
      <View style={styles.container}>
        <Text style={styles.title}>Pair Bracelet</Text>
        <Text style={styles.description}>
          Your festival bracelet will automatically pair with the app via Bluetooth. Use the buttons below to start scanning or reset the connection.
        </Text>

        {/* BLE Status */}
        {renderStatus()}

        {/* Auto-reconnect message */}
        {autoReconnectMsg ? <Text style={styles.message}>{autoReconnectMsg}</Text> : null}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Start Scan" onPress={startScan} color="#b0ff4b" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Reset / Pair New Device" onPress={resetPairing} color="#ff5757" />
        </View>

        {/* Optional device list */}
        <Text style={styles.deviceListTitle}>Available Devices (Simulation)</Text>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text style={styles.deviceItem}>{item.name}</Text>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 5,
  },
  deviceListTitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
  deviceItem: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 2,
  },
});
