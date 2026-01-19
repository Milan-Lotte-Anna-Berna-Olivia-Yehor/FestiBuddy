import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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
import { udpService } from '../../services/UDPService';

export default function OrganizerDashboard() {
  const [activeMode, setActiveMode] = useState("IDLE"); 
  const [lastCommand, setLastCommand] = useState("System Ready");
  const [packetCount, setPacketCount] = useState(0); // Simulácia aktivity siete
  
  const effectInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    udpService.init();
    return () => stopCurrentEffect();
  }, []);

  // Pomocná funkcia na odoslanie a započítanie paketu
  const sendUDP = (r: number, g: number, b: number) => {
      udpService.broadcastColor(r, g, b);
      setPacketCount(prev => prev + 1);
  };

  const stopCurrentEffect = () => {
    if (effectInterval.current) {
      clearInterval(effectInterval.current);
      effectInterval.current = null;
    }
  };

  // --- STATICKÉ FARBY ---
  const handleStaticColor = (colorHex: string, rgb: number[], name: string) => {
    stopCurrentEffect();
    Vibration.vibrate(15);
    setLastCommand(name);
    setActiveMode(name === "BLACKOUT" ? "IDLE" : "MANUAL");
    sendUDP(rgb[0], rgb[1], rgb[2]);
  };

  // --- DYNAMICKÉ SLUČKY (PARTY MODE) ---
  const handleLoopEffect = (type: string) => {
    stopCurrentEffect();
    Vibration.vibrate([0, 20, 20, 20]);
    setActiveMode("FX");
    
    let tick = 0;

    if (type === 'STROBE') {
        setLastCommand("⚡ WHITE STROBE");
        effectInterval.current = setInterval(() => {
            const val = tick % 2 === 0 ? 255 : 0;
            sendUDP(val, val, val);
            tick++;
        }, 80); // 80ms (Veľmi rýchlo)
    } 
    else if (type === 'POLICE') {
        setLastCommand("🚓 POLICE SIREN");
        effectInterval.current = setInterval(() => {
            if (tick % 2 === 0) sendUDP(255, 0, 0); // Red
            else sendUDP(0, 0, 255); // Blue
            tick++;
        }, 300);
    }
    else if (type === 'DISCO') {
        setLastCommand("🕺 DISCO CHAOS");
        effectInterval.current = setInterval(() => {
            // Generuje náhodné RGB farby
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            sendUDP(r, g, b);
            tick++;
        }, 150); // Chaos každých 150ms
    }
    else if (type === 'HEARTBEAT') {
        setLastCommand("❤️ RED PULSE");
        // Simulácia pulzu: Tma -> Tmavá Červená -> Jasná Červená -> Tmavá -> Tma
        const seq = [0, 50, 255, 50, 0, 0]; 
        effectInterval.current = setInterval(() => {
            const val = seq[tick % seq.length];
            sendUDP(val, 0, 0);
            tick++;
        }, 100);
    }
    else if (type === 'TRAFFIC') {
        setLastCommand("🚦 TRAFFIC LIGHTS");
        const seq = [
            [255, 0, 0],   // Red
            [255, 0, 0], 
            [255, 100, 0], // Orange
            [0, 255, 0],   // Green
            [0, 255, 0],
            [0, 255, 0]
        ];
        effectInterval.current = setInterval(() => {
            const c = seq[tick % seq.length];
            sendUDP(c[0], c[1], c[2]);
            tick++;
        }, 800); // Pomalšie prepínanie
    }
  };

  const triggerSOS = () => {
    Alert.alert(
        "CONFIRM EMERGENCY",
        "Turns ALL wristbands RED + Strobe.",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "ACTIVATE SOS", 
                style: "destructive", 
                onPress: () => {
                    stopCurrentEffect();
                    setActiveMode("SOS");
                    setLastCommand("⚠️ EMERGENCY ACTIVE");
                    let tick = 0;
                    effectInterval.current = setInterval(() => {
                        const val = tick % 2 === 0;
                        if(val) sendUDP(255, 0, 0); 
                        else sendUDP(0, 0, 0);   
                        tick++;
                    }, 100);
                } 
            }
        ]
    );
  };

  const resetSystem = () => {
      handleStaticColor("#000000", [0,0,0], "BLACKOUT");
      setPacketCount(0);
  };

  // UI Components
  const ControlButton = ({ label, color, icon, onPress, isActive }: any) => (
    <TouchableOpacity 
        style={[
            styles.controlBtn, 
            { borderColor: color },
            isActive && { backgroundColor: color, shadowColor: color, shadowOpacity: 0.6, shadowRadius: 15, elevation: 10 }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.iconBox, { backgroundColor: isActive ? '#000' : 'rgba(255,255,255,0.1)' }]}>
            <Ionicons name={icon} size={24} color={isActive ? color : '#FFF'} />
        </View>
        <Text style={[styles.btnLabel, isActive && { color: '#000' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Main Stage Control</Text>
                <Text style={styles.headerSubtitle}>WiFi Broadcast • UDP:21324</Text>
            </View>
            <TouchableOpacity onPress={resetSystem} style={styles.resetBtn}>
                <Ionicons name="power" size={16} color="#000" />
                <Text style={styles.resetText}>RESET</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            
            {/* STATS GRID (Fake it 'til you make it) */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statVal}>UNLIMITED</Text>
                    <Text style={styles.statLabel}>Active Devices</Text>
                    <Ionicons name="infinite" size={16} color="#7CFF00" style={{position:'absolute', top:10, right:10}} />
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statVal}>{packetCount}</Text>
                    <Text style={styles.statLabel}>Packets Sent</Text>
                    <Ionicons name="wifi" size={16} color="#00E0FF" style={{position:'absolute', top:10, right:10}} />
                </View>
            </View>

            {/* STATUS PANEL */}
            <View style={[
                styles.statusPanel, 
                activeMode === "SOS" ? styles.statusSOS : 
                activeMode === "FX" ? styles.statusFX : styles.statusNormal
            ]}>
                <Text style={styles.statusLabel}>CURRENT OUTPUT</Text>
                <Text style={styles.statusMain}>{lastCommand}</Text>
            </View>

            {/* STATIC COLORS */}
            <Text style={styles.sectionTitle}>Solid Colors</Text>
            <View style={styles.controlsGrid}>
                <ControlButton label="Red" color="#FF0000" icon="color-fill" onPress={() => handleStaticColor("#FF0000", [255, 0, 0], "SOLID RED")} />
                <ControlButton label="Blue" color="#007AFF" icon="color-fill" onPress={() => handleStaticColor("#007AFF", [0, 0, 255], "SOLID BLUE")} />
                <ControlButton label="Green" color="#00FF00" icon="color-fill" onPress={() => handleStaticColor("#00FF00", [0, 255, 0], "SOLID GREEN")} />
            </View>
            <View style={styles.controlsGrid}>
                <ControlButton label="Purple" color="#FF00FF" icon="heart" onPress={() => handleStaticColor("#FF00FF", [255, 0, 255], "SOLID PURPLE")} />
                <ControlButton label="Cyan" color="#00FFFF" icon="water" onPress={() => handleStaticColor("#00FFFF", [0, 255, 255], "SOLID CYAN")} />
                <ControlButton label="Orange" color="#FFA500" icon="sunny" onPress={() => handleStaticColor("#FFA500", [255, 165, 0], "SOLID ORANGE")} />
            </View>

            {/* DYNAMIC EFFECTS */}
            <Text style={styles.sectionTitle}>Party Modes (Loop)</Text>
            <View style={styles.controlsGrid}>
                <ControlButton label="Strobe" color="#FFF" icon="flash" isActive={lastCommand === "⚡ WHITE STROBE"} onPress={() => handleLoopEffect('STROBE')} />
                <ControlButton label="Disco" color="#DFFF00" icon="musical-notes" isActive={lastCommand === "🕺 DISCO CHAOS"} onPress={() => handleLoopEffect('DISCO')} />
            </View>
            <View style={styles.controlsGrid}>
                <ControlButton label="Heartbeat" color="#FF0040" icon="pulse" isActive={lastCommand === "❤️ RED PULSE"} onPress={() => handleLoopEffect('HEARTBEAT')} />
                <ControlButton label="Police" color="#FF453A" icon="car-sport" isActive={lastCommand === "🚓 POLICE SIREN"} onPress={() => handleLoopEffect('POLICE')} />
            </View>
            <View style={styles.controlsGrid}>
                 <ControlButton label="Traffic" color="#00FF80" icon="stopwatch" isActive={lastCommand === "🚦 TRAFFIC LIGHTS"} onPress={() => handleLoopEffect('TRAFFIC')} />
            </View>

            {/* DANGER ZONE */}
            <Text style={[styles.sectionTitle, {color: '#FF3B30', marginTop: 20}]}>Danger Zone</Text>
            <TouchableOpacity style={styles.sosButton} onPress={triggerSOS} activeOpacity={0.8}>
                <View style={styles.sosInner}>
                    <Ionicons name="alert-circle" size={32} color="#FFF" />
                    <View>
                        <Text style={styles.sosButtonText}>GLOBAL SOS</Text>
                        <Text style={styles.sosSubText}>Emergency Protocol Override</Text>
                    </View>
                </View>
            </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  safeArea: { flex: 1 },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222', backgroundColor: '#090909'
  },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#00E0FF', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  
  resetBtn: {
    flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20, alignItems: 'center', gap: 4
  },
  resetText: { fontWeight: 'bold', fontSize: 10, color: '#000' },

  content: { padding: 20, paddingBottom: 60 },

  // STATS ROW
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { 
      flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#222',
      justifyContent: 'center'
  },
  statVal: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 11, textTransform: 'uppercase' },

  // STATUS PANEL
  statusPanel: {
    padding: 20, borderRadius: 12, marginBottom: 25,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1
  },
  statusNormal: { backgroundColor: '#111', borderColor: '#333' },
  statusFX: { backgroundColor: 'rgba(0, 224, 255, 0.08)', borderColor: '#00E0FF' },
  statusSOS: { backgroundColor: 'rgba(255, 0, 0, 0.2)', borderColor: '#FF0000' },
  
  statusLabel: { color: '#888', fontSize: 10, letterSpacing: 2, marginBottom: 5 },
  statusMain: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
  
  // CONTROLS
  sectionTitle: { color: '#555', fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  controlsGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  
  controlBtn: {
    flex: 1, minWidth: '30%', backgroundColor: '#0F0F0F', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 8
  },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // SOS BUTTON
  sosButton: {
    backgroundColor: '#220000', borderRadius: 16, borderWidth: 1, borderColor: '#FF3B30',
    marginBottom: 20
  },
  sosInner: {
    padding: 15, flexDirection: 'row', alignItems: 'center', gap: 15, justifyContent: 'center'
  },
  sosButtonText: { color: '#FF3B30', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  sosSubText: { color: '#FF3B30', opacity: 0.6, fontSize: 10 }
});