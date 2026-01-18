import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gatewayService } from "../../services/BLEGatewayService"; // <--- NOVÝ IMPORT

export default function OrganizerDashboard() {
  const [gatewayEnabled, setGatewayEnabled] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);
  const [activeMode, setActiveMode] = useState("AUTO");
  const [lastCommand, setLastCommand] = useState("Waiting for input...");

  // Čistenie pri odchode z obrazovky
  useEffect(() => {
    return () => {
        gatewayService.stopGateway();
    };
  }, []);

  const toggleGateway = (value: boolean) => {
    setGatewayEnabled(value);
    if (value) {
        // ZAPNUTIE GATEWAY
        gatewayService.startGateway((count) => {
            setConnectedCount(count);
        });
        setLastCommand("Gateway Active - Scanning...");
    } else {
        // VYPNUTIE GATEWAY
        gatewayService.stopGateway();
        setConnectedCount(0);
        setLastCommand("Gateway Stopped.");
    }
  };

  const handleCommand = async (mode: string, colorCode: string, uiName: string) => {
    if (!gatewayEnabled) {
        Alert.alert("Gateway Offline", "Please enable the Gateway switch first.");
        return;
    }

    Vibration.vibrate(50);
    setActiveMode(uiName);
    setLastCommand(`Broadcasting: ${uiName}...`);

    // MAPOVANIE PRÍKAZOV PRE ESP32
    // 'S' = SOS, 'C' = Connect, '1' = Blue, '0' = Off
    let bleCommand = "0"; 

    if (mode === "SOS") bleCommand = "S";
    else if (mode === "AUTO") bleCommand = "0";
    else if (colorCode === "#007AFF") bleCommand = "1"; // Modrá
    // Tu môžeš pridať ďalšie farby ak upravíš C++ kód (napr. '2'=Red, '3'=Green)

    await gatewayService.broadcastCommand(bleCommand);
  };

  // UI Komponent pre štatistiku
  const StatBox = ({ label, value, color = "#FFF" }: any) => (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Crowd Control</Text>
            <Text style={styles.headerSubtitle}>Master Gateway</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={[styles.dot, gatewayEnabled && styles.dotActive]} />
            <Text style={styles.liveText}>{gatewayEnabled ? "ONLINE" : "OFFLINE"}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* GATEWAY CONTROL */}
          <View style={styles.controlPanel}>
             <View style={styles.gatewayRow}>
                <View>
                    <Text style={styles.panelTitle}>GATEWAY STATUS</Text>
                    <Text style={styles.panelSubtitle}>
                        {gatewayEnabled ? "Scanning & Broadcasting" : "Disconnected"}
                    </Text>
                </View>
                <Switch 
                    value={gatewayEnabled} 
                    onValueChange={toggleGateway}
                    trackColor={{ false: "#333", true: "#7CFF00" }}
                    thumbColor={"#FFF"}
                />
             </View>
             
             <View style={styles.statsRow}>
                <StatBox label="Active Nodes" value={connectedCount} color="#7CFF00" />
                <StatBox label="Packet Loss" value="0%" />
                <StatBox label="Latency" value="12ms" />
             </View>
          </View>

          {/* STATUS LOG */}
          <View style={styles.logPanel}>
            <Text style={styles.logLabel}>LAST COMMAND LOG</Text>
            <Text style={styles.logText}>system_root@festibuddy:~$ {lastCommand}</Text>
          </View>

          {/* COLOR CONTROLS */}
          <Text style={styles.sectionTitle}>Global Override</Text>
          <View style={styles.grid}>
            <TouchableOpacity 
                style={[styles.card, {backgroundColor: '#007AFF'}]} 
                onPress={() => handleCommand("SOLID", "#007AFF", "CROWD BLUE")}
            >
                <Ionicons name="water" size={32} color="#FFF" />
                <Text style={styles.cardText}>BLUE WAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.card, {backgroundColor: '#FF3B30'}]} 
                onPress={() => handleCommand("SOS", "#FF0000", "EMERGENCY SOS")}
            >
                <Ionicons name="alert-circle" size={32} color="#FFF" />
                <Text style={styles.cardText}>MASS SOS</Text>
            </TouchableOpacity>

             <TouchableOpacity 
                style={[styles.card, {backgroundColor: '#111', borderWidth: 1, borderColor: '#333'}]} 
                onPress={() => handleCommand("AUTO", "#000", "SYSTEM OFF")}
            >
                <Ionicons name="power" size={32} color="#666" />
                <Text style={[styles.cardText, {color: '#666'}]}>BLACKOUT</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A1A'
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#666', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#444', marginRight: 8 },
  dotActive: { backgroundColor: '#7CFF00' },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  scrollContent: { padding: 20 },

  controlPanel: {
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#333'
  },
  gatewayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  panelTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  panelSubtitle: { color: '#666', fontSize: 12 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, marginTop: 4 },

  logPanel: {
    backgroundColor: '#000', borderRadius: 8, padding: 12, marginBottom: 30,
    borderWidth: 1, borderColor: '#333', borderLeftWidth: 4, borderLeftColor: '#7CFF00'
  },
  logLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  logText: { color: '#7CFF00', fontFamily: 'Courier', fontSize: 12 },

  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  card: {
    width: '48%', height: 120, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10
  },
  cardText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});