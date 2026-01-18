import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

export default function LockerScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. POUŽITIE HEADERA - TOTO OPRAVUJE NAVIGÁCIU */}
      <ScreenHeader title="My Locker" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* LOCKER STATUS CARD */}
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name="lock-open" size={40} color="#7CFF00" />
            </View>
            <Text style={styles.lockerTitle}>Locker #402</Text>
            <Text style={styles.lockerStatus}>Status: UNLOCKED</Text>
            
            <View style={styles.qrPlaceholder}>
                 <Ionicons name="qr-code" size={100} color="#FFF" />
                 <Text style={styles.qrText}>Scan at locker terminal</Text>
            </View>
        </View>

        {/* ACTIONS */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Share Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="time-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Extend Time</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  card: {
    backgroundColor: '#1A1A1A', borderRadius: 24, padding: 30,
    alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: '#333'
  },
  iconContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(124, 255, 0, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#7CFF00'
  },
  lockerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  lockerStatus: { color: '#7CFF00', fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 30 },
  qrPlaceholder: { alignItems: 'center', opacity: 0.8 },
  qrText: { color: '#666', marginTop: 10 },
  
  sectionTitle: { color: '#666', fontSize: 14, fontWeight: 'bold', marginBottom: 16, textTransform: 'uppercase' },
  actionRow: { flexDirection: 'row', gap: 16 },
  actionButton: {
    flex: 1, backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#333'
  },
  actionText: { color: '#FFF', marginTop: 8, fontWeight: '600' }
});