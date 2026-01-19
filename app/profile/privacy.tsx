import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { bleService } from "../../services/BLEService"; // Import našej služby

export default function PairBraceletScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [statusText, setStatusText] = useState("Ready to pair");

  useEffect(() => {
    checkStatus();
    // Vyžiadame povolenia pri otvorení obrazovky
    bleService.requestPermissions();
  }, []);

  const checkStatus = async () => {
    const paired = await AsyncStorage.getItem("isBraceletPaired");
    if (paired === "true") {
        setIsPaired(true);
        setStatusText("Device Connected");
    }
  };

  const startScan = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setStatusText("Scanning for FestiBuddy_Node...");

    bleService.scanAndConnect(
        () => {
            // Success Callback
            setIsScanning(false);
            setIsPaired(true);
            setStatusText("Connected Successfully! 🎉");
            Alert.alert("Success", "Your bracelet is now paired and synced!");
        },
        (error) => {
            // Error Callback
            setIsScanning(false);
            setStatusText("Scan failed. Try again.");
            Alert.alert("Error", "Could not find bracelet. Make sure it's ON.\n\n" + error);
        }
    );
  };

  const disconnect = async () => {
      await bleService.disconnect();
      setIsPaired(false);
      setStatusText("Disconnected");
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Pair Bracelet" />

      <View style={styles.content}>
        {/* SCANNING ANIMATION CIRCLE */}
        <View style={[styles.scanCircle, isPaired && styles.pairedCircle]}>
            {isScanning ? (
                <ActivityIndicator size="large" color="#7CFF00" />
            ) : (
                <Ionicons 
                    name={isPaired ? "checkmark-circle" : "bluetooth"} 
                    size={80} 
                    color={isPaired ? "#000" : "#7CFF00"} 
                />
            )}
            
            {/* Ripple effect only when scanning */}
            {isScanning && <View style={styles.ripple} />}
        </View>

        <Text style={[styles.statusText, isPaired && {color: '#7CFF00'}]}>
            {statusText}
        </Text>
        
        <Text style={styles.hintText}>
            {isPaired 
                ? "Your wristband is active. You can control the light color from your profile or sync with the crowd."
                : "Hold the button on your wristband for 3 seconds until it blinks blue."
            }
        </Text>

        {!isPaired ? (
            <TouchableOpacity 
                style={[styles.scanButton, isScanning && {opacity: 0.7}]} 
                onPress={startScan}
                disabled={isScanning}
            >
                <Text style={styles.btnText}>
                    {isScanning ? "Scanning..." : "Start Scan"}
                </Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
                style={[styles.scanButton, styles.disconnectBtn]} 
                onPress={disconnect}
            >
                <Text style={[styles.btnText, {color: '#FFF'}]}>Disconnect</Text>
            </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  
  scanCircle: {
    width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(124, 255, 0, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
    borderWidth: 2, borderColor: '#7CFF00'
  },
  pairedCircle: {
    backgroundColor: '#7CFF00', // Plná zelená keď je pripojené
    borderColor: '#7CFF00'
  },
  ripple: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 1, borderColor: 'rgba(124, 255, 0, 0.3)',
  },
  
  statusText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  hintText: { color: '#888', textAlign: 'center', fontSize: 16, marginBottom: 50, paddingHorizontal: 20, lineHeight: 22 },
  
  scanButton: {
    backgroundColor: '#7CFF00', paddingVertical: 18, paddingHorizontal: 60, borderRadius: 30,
    width: '100%', alignItems: 'center'
  },
  disconnectBtn: {
    backgroundColor: '#333',
    borderWidth: 1, borderColor: '#666'
  },
  btnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});