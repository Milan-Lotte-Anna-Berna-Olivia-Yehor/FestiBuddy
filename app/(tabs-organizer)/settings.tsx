import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase/firebaseConfig";

export default function OrganizerSettingsScreen() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@festibuddy.com");
  const [gatewayStatus, setGatewayStatus] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser?.email) {
        setAdminEmail(auth.currentUser.email);
      }
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Terminate Session", 
      "Are you sure you want to log out from Command Center?", 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.clear();
              router.replace("/");
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const InfoRow = ({ label, value, color = "#FFF" }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>System Settings</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>ADMIN ACCESS</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            
            {/* ADMIN PROFILE */}
            <View style={styles.card}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Ionicons name="shield-checkmark" size={30} color="#000" />
                    </View>
                    <View>
                        <Text style={styles.adminName}>Head Organizer</Text>
                        <Text style={styles.adminEmail}>{adminEmail}</Text>
                    </View>
                </View>
            </View>

            {/* SYSTEM STATUS */}
            <Text style={styles.sectionTitle}>Network Diagnostics</Text>
            <View style={styles.card}>
                <InfoRow label="Gateway Connection" value="STABLE" color="#7CFF00" />
                <View style={styles.divider} />
                <InfoRow label="Latency" value="24 ms" />
                <View style={styles.divider} />
                <InfoRow label="Data Packet Loss" value="0.02%" />
                <View style={styles.divider} />
                <InfoRow label="Uptime" value="14h 32m" />
            </View>

            {/* CONTROLS */}
            <Text style={styles.sectionTitle}>Configuration</Text>
            <View style={styles.card}>
                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Gateway Auto-Reconnect</Text>
                    <Switch 
                        value={gatewayStatus} 
                        onValueChange={setGatewayStatus}
                        trackColor={{ false: "#333", true: "#7CFF00" }}
                    />
                </View>
                <View style={styles.divider} />
                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Debug Logs</Text>
                    <Switch 
                        value={debugMode} 
                        onValueChange={setDebugMode}
                        trackColor={{ false: "#333", true: "#7CFF00" }}
                    />
                </View>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="power" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>TERMINATE SESSION</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>FestiBuddy Command Center v2.0 • Build 8492</Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  
  header: {
    paddingHorizontal: 24, paddingVertical: 16, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  badge: { backgroundColor: '#1A1A1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#7CFF00' },
  badgeText: { color: '#7CFF00', fontSize: 10, fontWeight: 'bold' },

  content: { paddingHorizontal: 24 },

  card: {
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#333'
  },
  
  // PROFILE
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#7CFF00', justifyContent: 'center', alignItems: 'center' },
  adminName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  adminEmail: { color: '#888', fontSize: 14 },

  // INFO ROWS
  sectionTitle: { color: '#666', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#CCC', fontSize: 16 },
  value: { fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 8 },

  // SWITCHES
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  switchLabel: { color: '#FFF', fontSize: 16 },

  // LOGOUT
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FF3B30', marginTop: 10, marginBottom: 30, gap: 10
  },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  
  versionText: { color: '#444', textAlign: 'center', fontSize: 12, paddingBottom: 20 },
});