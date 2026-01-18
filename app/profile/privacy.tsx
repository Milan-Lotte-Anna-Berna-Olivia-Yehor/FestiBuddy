import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

export default function PrivacyScreen() {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [allowTags, setAllowTags] = useState(false);

  const SettingRow = ({ label, value, onValueChange, desc }: any) => (
    <View style={styles.row}>
       <View style={{flex: 1}}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.desc}>{desc}</Text>
       </View>
       <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: "#333", true: "#7CFF00" }}
       />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Privacy & Security" rightIcon="shield-checkmark-outline" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Visibility</Text>
        <View style={styles.card}>
            <SettingRow 
               label="Public Profile" 
               desc="Allow others to find you by name"
               value={profileVisible}
               onValueChange={setProfileVisible}
            />
            <View style={styles.divider} />
            <SettingRow 
               label="Share Live Location" 
               desc="Visible to added friends only"
               value={showLocation}
               onValueChange={setShowLocation}
            />
             <View style={styles.divider} />
            <SettingRow 
               label="Photo Tagging" 
               desc="Allow friends to tag you in photos"
               value={allowTags}
               onValueChange={setAllowTags}
            />
        </View>

        <Text style={styles.sectionTitle}>Data & Documents</Text>
        <View style={styles.card}>
            <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
             <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Export My Data</Text>
                <Ionicons name="download-outline" size={20} color="#7CFF00" />
            </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.deleteButton}>
             <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  sectionTitle: { color: '#7CFF00', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 10 },
  card: { backgroundColor: '#1A1A1A', borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  label: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  desc: { color: '#888', fontSize: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#222', marginHorizontal: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  linkText: { color: '#FFF', fontSize: 16 },
  deleteButton: { alignItems: 'center', marginTop: 20 },
  deleteText: { color: '#FF3B30', fontSize: 14, fontWeight: 'bold' }
});