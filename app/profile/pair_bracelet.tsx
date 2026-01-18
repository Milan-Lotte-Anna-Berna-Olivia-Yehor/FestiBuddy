import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader"; // Uisti sa, že máš tento komponent alebo ho vymaž a daj len View
import { bleService } from "../../services/BLEService";

export default function PairBraceletScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [statusLog, setStatusLog] = useState("Ready to pair.");
  
  // Animácia pulzovania
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkConnection();
    startPulse();
    
    // Vyžiadanie povolení hneď pri štarte
    bleService.requestPermissions().then((granted) => {
        if (!granted) appendLog("❌ Permissions denied!");
    });
  }, []);

  const checkConnection = async () => {
    const paired = await AsyncStorage.getItem("isBraceletPaired");
    if (paired === "true") {
      setIsConnected(true);
      setStatusLog("✅ Wristband connected & ready.");
    }
  };

  const appendLog = (msg: string) => {
    setStatusLog(msg); // Pre jednoduchosť ukazujeme len poslednú správu
    console.log("[BLE UI]:", msg);
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    appendLog("🔍 Scanning for FestiBuddy_Node...");

    // Timeout pre istotu, ak by nič nenašiel
    const scanTimeout = setTimeout(() => {
        if (isScanning) {
            setIsScanning(false);
            appendLog("⚠️ Device not found. Try again.");
            Alert.alert("Not Found", "Make sure the device is ON and close to phone.");
        }
    }, 12000);

    bleService.scanAndConnect(
      () => {
        // SUCCESS
        clearTimeout(scanTimeout);
        setIsScanning(false);
        setIsConnected(true);
        Vibration.vibrate(200);
        appendLog("✅ Connected! Light should be GREEN.");
        Alert.alert("Success!", "Your wristband is paired.");
      },
      (errorMsg) => {
        // ERROR
        clearTimeout(scanTimeout);
        setIsScanning(false);
        appendLog(`❌ Error: ${errorMsg}`);
        Alert.alert("Connection Failed", errorMsg);
      }
    );
  };

  const handleDisconnect = async () => {
    await bleService.disconnect();
    setIsConnected(false);
    appendLog("Disconnected.");
    Vibration.vibrate(50);
  };

  const testLight = async () => {
    appendLog("Sending Test Signal (Blue)...");
    await bleService.sendCommand("1"); // Pošle modrú
    setTimeout(() => bleService.sendCommand("0"), 1000); // Po sekunde vypne
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Pair Bracelet" />

      <View style={styles.content}>
        
        {/* VISUAL INDICATOR */}
        <View style={styles.circleContainer}>
          {/* Pulzujúci kruh */}
          {isScanning && (
            <Animated.View
              style={[
                styles.pulseCircle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
          )}
          
          <View style={[styles.mainCircle, isConnected && styles.connectedCircle]}>
             {isScanning ? (
                 <ActivityIndicator size="large" color="#000" />
             ) : (
                 <Ionicons 
                    name={isConnected ? "checkmark" : "bluetooth"} 
                    size={60} 
                    color={isConnected ? "#000" : "#7CFF00"} 
                 />
             )}
          </View>
        </View>

        {/* STATUS TEXT */}
        <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>STATUS LOG:</Text>
            <Text style={styles.statusText}>{statusLog}</Text>
        </View>

        {/* INSTRUCTIONS */}
        {!isConnected && !isScanning && (
            <Text style={styles.hintText}>
                Ensure your wristband is powered ON.{'\n'}
                Hold your phone close to the device.
            </Text>
        )}

        {/* ACTIONS */}
        <View style={styles.buttonContainer}>
          {!isConnected ? (
            <TouchableOpacity
              style={[styles.btn, styles.scanBtn, isScanning && { opacity: 0.5 }]}
              onPress={handleScan}
              disabled={isScanning}
            >
              <Text style={styles.btnText}>
                {isScanning ? "SCANNING..." : "START PAIRING"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
                <TouchableOpacity style={[styles.btn, styles.testBtn]} onPress={testLight}>
                    <Ionicons name="flash" size={20} color="#000" style={{marginRight: 8}} />
                    <Text style={styles.btnText}>TEST FLASH</Text>
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
  
  circleContainer: {
    width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 40
  },
  pulseCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(124, 255, 0, 0.2)',
  },
  mainCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#1A1A1A', borderWidth: 2, borderColor: '#7CFF00',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#7CFF00", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 10
  },
  connectedCircle: {
    backgroundColor: '#7CFF00', borderColor: '#FFF'
  },

  statusContainer: {
    width: '100%', backgroundColor: '#111', padding: 16, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: '#333'
  },
  statusLabel: { color: '#666', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  statusText: { color: '#FFF', fontSize: 14, fontFamily: 'System' },

  hintText: { color: '#888', textAlign: 'center', marginBottom: 30, lineHeight: 22 },

  buttonContainer: { width: '100%', gap: 16 },
  btn: {
    height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
  },
  scanBtn: { backgroundColor: '#7CFF00' },
  testBtn: { backgroundColor: '#7CFF00', marginBottom: 0 },
  disconnectBtn: { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' },
  
  btnText: { fontSize: 16, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
});