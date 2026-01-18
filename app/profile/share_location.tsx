import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

export default function ShareLocationScreen() {
  const [isSharing, setIsSharing] = React.useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Location Sharing" />

      <View style={styles.content}>
        <View style={styles.mapPreview}>
             <Ionicons name="map" size={60} color="#333" />
             <Text style={{color: '#666', marginTop: 10}}>Map Preview</Text>
        </View>

        <View style={styles.card}>
            <View style={{flex: 1}}>
                <Text style={styles.label}>Share My Live Location</Text>
                <Text style={styles.desc}>Allow friends to see you on the map</Text>
            </View>
            <Switch 
                value={isSharing} 
                onValueChange={setIsSharing}
                trackColor={{ false: "#333", true: "#7CFF00" }}
            />
        </View>
        
        <Text style={styles.statusText}>
            {isSharing ? "You are currently visible to 12 friends." : "You are invisible."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  mapPreview: { height: 200, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  label: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#888', marginTop: 4 },
  statusText: { color: '#7CFF00', textAlign: 'center', marginTop: 20, fontSize: 14 }
});