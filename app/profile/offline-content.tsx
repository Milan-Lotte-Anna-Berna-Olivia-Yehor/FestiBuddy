import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

const offlinePackages = [
  { id: '1', title: 'Festival Map 2026', size: '15 MB', status: 'Downloaded', icon: 'map' },
  { id: '2', title: 'Lineup & Schedule', size: '2 MB', status: 'Downloaded', icon: 'calendar' },
  { id: '3', title: 'Artist Bios & Photos', size: '45 MB', status: 'Not Downloaded', icon: 'people' },
];

export default function OfflineContentScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Offline Content" rightIcon="cloud-download-outline" />

      <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#7CFF00" />
          <Text style={styles.infoText}>
              Download content to access maps and schedules even when signal is lost.
          </Text>
      </View>

      <FlatList
        data={offlinePackages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <View style={styles.iconBox}>
                     {/* @ts-ignore */}
                    <Ionicons name={item.icon} size={24} color="#FFF" />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.size}>{item.size}</Text>
                </View>
                
                {item.status === 'Downloaded' ? (
                    <TouchableOpacity style={styles.downloadedBtn}>
                         <Ionicons name="checkmark" size={20} color="#000" />
                         <Text style={styles.btnText}>Ready</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.downloadBtn}>
                         <Ionicons name="download" size={20} color="#000" />
                    </TouchableOpacity>
                )}
            </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  infoBox: { flexDirection: 'row', backgroundColor: 'rgba(124, 255, 0, 0.1)', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(124, 255, 0, 0.3)' },
  infoText: { color: '#FFF', flex: 1, fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  size: { color: '#666', fontSize: 12 },
  downloadedBtn: { flexDirection: 'row', backgroundColor: '#7CFF00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 4 },
  downloadBtn: { backgroundColor: '#FFF', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: 'bold' }
});