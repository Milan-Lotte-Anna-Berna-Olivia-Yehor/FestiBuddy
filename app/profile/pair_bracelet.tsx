import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { bleService } from "../../services/BLEService";

export default function PairBraceletScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [statusLog, setStatusLog] = useState("Ready to pair.");
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkConnection();
    startPulse();
    bleService.requestPermissions();
  }, []);

  const checkConnection = async () => {
    const paired = await AsyncStorage.getItem("isBraceletPaired");
    if (paired === "true") setIsConnected(true);
  };

  const appendLog = (msg: string) => {
    setStatusLog(msg);
    console.log("[BLE UI]:", msg);
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    appendLog("🔍 Scanning...");

    const scanTimeout = setTimeout(() => {
        if (isScanning) {
            setIsScanning(false);
            appendLog("⚠️ Device not found.");
            Alert.alert("Not Found", "Check if wristband is ON.");
        }
    }, 10000);

    bleService.scanAndConnect(
      () => {
        clearTimeout(scanTimeout);
        setIsScanning(false);
        setIsConnected(true);
        Vibration.vibrate(200);
        appendLog("✅ Connected! (Green Flash)");
      },
      (errorMsg) => {
        clearTimeout(scanTimeout);
        setIsScanning(false);
        appendLog(`❌ Error: ${errorMsg}`);
      }
    );
  };

  const handleDisconnect = async () => {
    await bleService.disconnect();
    setIsConnected(false);
    appendLog("Disconnected.");
  };

  // --- OPRAVENÝ RAINBOW TEST ---
  const testLight = async () => {
    appendLog("🌈 Sending Rainbow Test...");
    
    // Posielame 'T' pre Test (Rainbow)
    // Ak máš v BLEService len 'S' a 'C', pridaj tam aj 'T', 
    // alebo pošli priamo Base64 pre 'T', čo je "VA=="
    await bleService.sendCommand("T"); 

    // Po 3 sekundách automaticky vypneme
    setTimeout(() => {
        bleService.sendCommand("0");
        appendLog("Test ended.");
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Pair Bracelet" />
      <View style={styles.content}>
        
        {/* Kruh s ikonou */}
        <View style={styles.circleContainer}>
          {isScanning && (
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
          )}
          <View style={[styles.mainCircle, isConnected && styles.connectedCircle]}>
             {isScanning ? <ActivityIndicator size="large" color="#000" /> : 
             <Ionicons name={isConnected ? "checkmark" : "bluetooth"} size={60} color={isConnected ? "#000" : "#7CFF00"} />}
          </View>
        </View>

        <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>STATUS LOG:</Text>
            <Text style={styles.statusText}>{statusLog}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {!isConnected ? (
            <TouchableOpacity style={[styles.btn, styles.scanBtn]} onPress={handleScan} disabled={isScanning}>
              <Text style={styles.btnText}>{isScanning ? "SCANNING..." : "START PAIRING"}</Text>
            </TouchableOpacity>
          ) : (
            <>
                <TouchableOpacity style={[styles.btn, styles.testBtn]} onPress={testLight}>
                    <Ionicons name="color-palette" size={20} color="#000" style={{marginRight: 8}} />
                    <Text style={styles.btnText}>TEST RAINBOW</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.disconnectBtn]} onPress={handleDisconnect}>
                    <Text style={[styles.btnText, { color: '#FFF' }]}>DISCONNECT</Text>
                </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  circleContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  pulseCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(124, 255, 0, 0.2)' },
  mainCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1A1A1A', borderWidth: 2, borderColor: '#7CFF00', justifyContent: 'center', alignItems: 'center' },
  connectedCircle: { backgroundColor: '#7CFF00', borderColor: '#FFF' },
  statusContainer: { width: '100%', backgroundColor: '#111', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  statusLabel: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  statusText: { color: '#FFF', fontSize: 14 },
  buttonContainer: { width: '100%', gap: 16 },
  btn: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  scanBtn: { backgroundColor: '#7CFF00' },
  testBtn: { backgroundColor: '#00E0FF', marginBottom: 0 }, // Modrá pre Rainbow test
  disconnectBtn: { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' },
  btnText: { fontSize: 16, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
});