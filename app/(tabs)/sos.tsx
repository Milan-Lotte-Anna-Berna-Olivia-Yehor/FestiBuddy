import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bleService } from "../../services/BLEService";

export default function SOSScreen() {
  const [isActive, setIsActive] = useState(false);

  const handlePressIn = () => {
    setIsActive(true);
    Vibration.vibrate(100); 
    bleService.sendCommand("S"); // Pošle príkaz pre SOS (Červený stroboskop) [cite: 48]
  };

  const handlePressOut = () => {
    setIsActive(false);
    bleService.sendCommand("0"); // Vypne SOS a vráti do IDLE
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EMERGENCY SOS</Text>
      <Text style={styles.subtitle}>Hold the button to alert security</Text>
      
      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={[styles.sosButton, isActive && styles.sosActive]}
          activeOpacity={1}
          onPressIn={handlePressIn}   
          onPressOut={handlePressOut}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="alert" size={80} color="#FFF" />
          </View>
          <Text style={styles.sosText}>{isActive ? "SENDING..." : "HOLD FOR HELP"}</Text>
        </TouchableOpacity>
      </View>

      {/* VRÁTENÉ VAROVANIE O ZNEUŽITÍ */}
      <View style={styles.warningBox}>
        <Ionicons name="information-circle" size={24} color="#888" />
        <Text style={styles.warningText}>
          Only use this feature in case of a real emergency. Misuse may result in a ban from the festival network.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { color: "#FF0000", fontSize: 32, fontWeight: "900", textAlign: "center", marginTop: 20 },
  subtitle: { color: "#FFF", fontSize: 16, textAlign: "center", marginBottom: 50 },
  
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  sosButton: { 
    width: 280, height: 280, borderRadius: 140, 
    backgroundColor: "#300", borderWidth: 4, borderColor: "#FF0000", 
    justifyContent: "center", alignItems: "center",
    shadowColor: "#FF0000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20,
    elevation: 10
  },
  sosActive: { 
    backgroundColor: "#FF0000", 
    transform: [{ scale: 0.95 }] 
  },
  
  iconContainer: { marginBottom: 10 },
  sosText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },

  // Štýly pre varovný box
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  warningText: { color: '#888', flex: 1, fontSize: 14, lineHeight: 20 }
});