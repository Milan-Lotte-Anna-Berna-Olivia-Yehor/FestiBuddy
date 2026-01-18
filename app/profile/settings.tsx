import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

export default function SettingsScreen() {
  const [isDark, setIsDark] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="App Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            
            <View style={styles.row}>
                <Text style={styles.label}>Dark Mode</Text>
                <Switch 
                    value={isDark} 
                    onValueChange={setIsDark}
                    trackColor={{ false: "#333", true: "#7CFF00" }}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Push Notifications</Text>
                <Switch 
                    value={notifications} 
                    onValueChange={setNotifications}
                    trackColor={{ false: "#333", true: "#7CFF00" }}
                />
            </View>
        </View>

        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Data</Text>
             <View style={styles.row}>
                <Text style={styles.label}>Cache Size</Text>
                <Text style={styles.value}>124 MB</Text>
            </View>
             <View style={styles.row}>
                <Text style={styles.label}>App Version</Text>
                <Text style={styles.value}>1.0.2</Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#7CFF00', fontSize: 14, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 8
  },
  label: { color: '#FFF', fontSize: 16 },
  value: { color: '#888', fontSize: 14 }
});