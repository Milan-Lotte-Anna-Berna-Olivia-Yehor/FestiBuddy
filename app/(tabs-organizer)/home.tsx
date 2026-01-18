import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { crowdStats, sendCrowdCommand } from "../../services/WristbandCommander";

export default function OrganizerDashboard() {
  const [activeMode, setActiveMode] = useState("AUTO"); // AUTO, MANUAL, SOS
  const [lastCommand, setLastCommand] = useState("Sync with Music");

  const handleCommand = async (mode: string, color: string, name: string) => {
    Vibration.vibrate(50); // Haptická odozva
    setLastCommand("Sending...");
    
    await sendCrowdCommand(mode, color);
    
    setLastCommand(name);
    if (mode === "SOS") {
        setActiveMode("SOS");
    } else {
        setActiveMode("MANUAL");
    }
  };

  const triggerSOS = () => {
    Alert.alert(
        "CONFIRM EMERGENCY",
        "This will turn ALL wristbands RED and start strobing. Use only in emergency!",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "ACTIVATE SOS", 
                style: "destructive", 
                onPress: () => handleCommand("SOS", "#FF0000", "⚠️ EMERGENCY ACTIVE") 
            }
        ]
    );
  };

  const resetSystem = () => {
      handleCommand("AUTO", "#000000", "Sync with Music");
      setActiveMode("AUTO");
  };

  const ControlButton = ({ label, color, icon, mode }: any) => (
    <TouchableOpacity 
        style={[styles.controlBtn, { borderColor: color }]}
        onPress={() => handleCommand(mode, color, label)}
    >
        <View style={[styles.iconBox, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color={color === '#FFFFFF' ? '#000' : '#FFF'} />
        </View>
        <Text style={styles.btnLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Crowd Control</Text>
                <Text style={styles.headerSubtitle}>Main Stage Gateway • Online</Text>
            </View>
            <TouchableOpacity onPress={resetSystem} style={styles.resetBtn}>
                <Ionicons name="refresh" size={20} color="#000" />
                <Text style={styles.resetText}>AUTO</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            
            {/* STATS GRID */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{crowdStats.activeWristbands.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Active Devices</Text>
                    <Ionicons name="people" size={16} color="#7CFF00" style={styles.statIcon} />
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{crowdStats.batteryAverage}%</Text>
                    <Text style={styles.statLabel}>Avg Battery</Text>
                    <Ionicons name="battery-charging" size={16} color="#7CFF00" style={styles.statIcon} />
                </View>
            </View>

            {/* LIVE STATUS */}
            <View style={[
                styles.statusPanel, 
                activeMode === "SOS" ? styles.statusSOS : styles.statusNormal
            ]}>
                <Text style={styles.statusLabel}>CURRENT OUTPUT</Text>
                <Text style={styles.statusMain}>{lastCommand}</Text>
                {activeMode === "SOS" && (
                    <View style={styles.sosBadge}>
                        <Ionicons name="warning" size={16} color="#FFF" />
                        <Text style={styles.sosText}>EMERGENCY PROTOCOL</Text>
                    </View>
                )}
            </View>

            {/* LIGHT CONTROLS */}
            <Text style={styles.sectionTitle}>Light Override</Text>
            <View style={styles.controlsGrid}>
                <ControlButton label="Crowd Red" color="#FF0000" icon="color-fill" mode="SOLID" />
                <ControlButton label="Crowd Blue" color="#007AFF" icon="color-fill" mode="SOLID" />
                <ControlButton label="Pure White" color="#FFFFFF" icon="flashlight" mode="SOLID" />
                <ControlButton label="Strobe" color="#FFD700" icon="flash" mode="STROBE" />
            </View>
            
            <View style={styles.controlsGrid}>
                <ControlButton label="Pulse Pink" color="#FF00FF" icon="pulse" mode="PULSE" />
                <ControlButton label="Ocean Wave" color="#00FFFF" icon="water" mode="WAVE" />
            </View>

            {/* EMERGENCY SECTION */}
            <Text style={[styles.sectionTitle, {color: '#FF3B30', marginTop: 30}]}>Danger Zone</Text>
            <TouchableOpacity style={styles.sosButton} onPress={triggerSOS} activeOpacity={0.8}>
                <View style={styles.sosInner}>
                    <Ionicons name="alert-circle" size={40} color="#FFF" />
                    <Text style={styles.sosButtonText}>TRIGGER GLOBAL SOS</Text>
                    <Text style={styles.sosSubText}>Turns all wristbands RED + Strobe</Text>
                </View>
            </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#222'
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#7CFF00', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  
  resetBtn: {
    flexDirection: 'row', backgroundColor: '#7CFF00', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, alignItems: 'center', gap: 6
  },
  resetText: { fontWeight: 'bold', fontSize: 12 },

  content: { padding: 24 },

  // STATS
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#333', position: 'relative'
  },
  statValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  statIcon: { position: 'absolute', top: 16, right: 16 },

  // STATUS PANEL
  statusPanel: {
    padding: 24, borderRadius: 16, marginBottom: 32,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1
  },
  statusNormal: { backgroundColor: 'rgba(124, 255, 0, 0.05)', borderColor: '#7CFF00' },
  statusSOS: { backgroundColor: 'rgba(255, 0, 0, 0.2)', borderColor: '#FF0000' },
  
  statusLabel: { color: '#888', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  statusMain: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
  
  sosBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF0000',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 12, gap: 6
  },
  sosText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // CONTROLS
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  controlsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12, flexWrap: 'wrap' },
  
  controlBtn: {
    flex: 1, minWidth: '45%', backgroundColor: '#111', padding: 16, borderRadius: 16,
    borderWidth: 1, alignItems: 'center', flexDirection: 'row', gap: 12
  },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // SOS BUTTON
  sosButton: {
    backgroundColor: '#300', borderRadius: 24, borderWidth: 2, borderColor: '#FF3B30',
    overflow: 'hidden', marginBottom: 40
  },
  sosInner: {
    padding: 24, alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  sosButtonText: { color: '#FF3B30', fontSize: 20, fontWeight: '900', marginTop: 8, letterSpacing: 1 },
  sosSubText: { color: '#FF3B30', opacity: 0.7, marginTop: 4 }
});