import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bleService } from "../../services/BLEService";

export default function SOSScreen() {
  const [isActive, setIsActive] = useState(false);

  const handlePressIn = () => {
    setIsActive(true);
    Vibration.vibrate([0, 500, 100, 500]); 
    console.log("SENDING SOS...");
    bleService.sendCommand("S"); // Spustí stroboskop
  };

  const handleStop = () => {
    setIsActive(false);
    console.log("SENDING STOP...");
    bleService.sendCommand("0"); // Vypne svetlá (teraz už funguje!)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EMERGENCY SOS</Text>
        <Text style={styles.subtitle}>Hold button to activate signal</Text>
      </View>
      
      {/* Hlavný obsah zarovnaný na stred */}
      <View style={styles.contentContainer}>
        
        {/* Veľké SOS tlačidlo */}
        <TouchableOpacity
          style={[styles.sosButton, isActive && styles.sosActive]}
          activeOpacity={1}
          onPressIn={handlePressIn}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="alert" size={80} color="#FFF" />
          </View>
          <Text style={styles.sosText}>{isActive ? "SIGNAL ACTIVE" : "HOLD FOR HELP"}</Text>
        </TouchableOpacity>

        {/* STOP tlačidlo - hneď pod tým */}
        <TouchableOpacity 
            style={[styles.stopButton, !isActive && styles.stopButtonDisabled]} 
            onPress={handleStop}
            disabled={!isActive}
        >
            <Text style={styles.stopText}>STOP SIGNAL</Text>
        </TouchableOpacity>

      </View>

      {/* Varovanie posunuté vyššie vďaka 'spaceru' alebo marginu */}
      <View style={styles.warningBox}>
        <Ionicons name="information-circle" size={24} color="#888" />
        <Text style={styles.warningText}>
          Signal remains active until you press STOP. Misuse is prohibited.
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40 // Dvíha spodok obrazovky vyššie
  },
  header: { 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  title: { color: "#FF0000", fontSize: 32, fontWeight: "900", textAlign: "center" },
  subtitle: { color: "#FFF", fontSize: 16, textAlign: "center", marginTop: 5, opacity: 0.8 },
  
  contentContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    gap: 30 // Medzera medzi prvkami
  },
  
  sosButton: { 
    width: 260, height: 260, borderRadius: 130, 
    backgroundColor: "#300", borderWidth: 4, borderColor: "#FF0000", 
    justifyContent: "center", alignItems: "center",
    shadowColor: "#FF0000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20,
    elevation: 10
  },
  sosActive: { 
    backgroundColor: "#FF0000", 
    transform: [{ scale: 1.05 }], 
    borderColor: "#FFF",
    shadowOpacity: 1
  },
  
  iconContainer: { marginBottom: 10 },
  sosText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },

  stopButton: {
      paddingHorizontal: 50, paddingVertical: 18,
      backgroundColor: '#222', borderRadius: 30, 
      borderWidth: 1, borderColor: '#555',
  },
  stopButtonDisabled: {
      opacity: 0, // Úplne zmizne keď nie je aktívne
  },
  stopText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },

  warningBox: {
    flexDirection: 'row', 
    backgroundColor: '#111', 
    padding: 16,
    borderRadius: 12, 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 60, // POSUNUTÉ VÝRAZNE VYŠŠIE
    borderWidth: 1, 
    borderColor: '#333'
  },
  warningText: { color: '#888', flex: 1, fontSize: 14, lineHeight: 20 }
});