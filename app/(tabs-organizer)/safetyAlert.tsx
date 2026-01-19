import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CloudRain, DoorOpen, ShieldAlert, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase/firebaseConfig';
import { udpService } from '../../services/UDPService'; // Import novej služby

const ALERT_TYPES = [
  { id: 'Weather Alert', sub: 'Severe weather conditions', icon: CloudRain, color: '#FFA500', rgb: [255, 165, 0] }, // Orange
  { id: 'Security Alert', sub: 'Security related incident', icon: ShieldAlert, color: '#FF0000', rgb: [255, 0, 0] }, // Red
  { id: 'Evacuation Notice', sub: 'Immediate evacuation required', icon: DoorOpen, color: '#FF0000', rgb: [255, 0, 0] }, // Red
  { id: 'Lost Person', sub: 'Missing person announcement', icon: Users, color: '#0000FF', rgb: [0, 0, 255] }, // Blue
];

export default function SafetyAlertScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'selection' | 'message'>('selection');
  const [selectedAlert, setSelectedAlert] = useState<typeof ALERT_TYPES[0] | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Inicializácia UDP pri načítaní obrazovky
  useEffect(() => {
    udpService.init();
    return () => udpService.close(); // Cleanup pri odchode
  }, []);

  const handleSend = async () => {
    if (!alertMessage.trim()) return Alert.alert("Error", "Enter a message");

    try {
      // 1. Zápis do Firebase (Pre notifikácie v telefónoch)
      await addDoc(collection(db, 'notifications'), {
        title: selectedAlert?.id,
        message: alertMessage,
        type: 'safety',
        severity: selectedAlert?.color === '#FF0000' ? 'high' : 'medium',
        createdAt: serverTimestamp(),
      });

      // 2. UDP Broadcast (Pre fyzické náramky)
      if (selectedAlert?.rgb) {
          console.log("Triggering Crowd Lights:", selectedAlert.id);
          // Použijeme BURST mód pre istotu doručenia
          udpService.broadcastBurst(
              selectedAlert.rgb[0], 
              selectedAlert.rgb[1], 
              selectedAlert.rgb[2]
          );
      }

      Alert.alert("Message Sent", "The safety alert has been broadcasted to app & wristbands!", [
        { text: "OK", onPress: () => {
          setAlertMessage('');
          setStep('selection');
          router.back();
        }}
      ]);
    } catch (e) { 
        console.error(e);
        Alert.alert("Error", "Failed to send alert."); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => step === 'message' ? setStep('selection') : router.back()}>
            <ArrowLeft color="white" size={30} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Send Safety Alert</Text>
        </View>

        {step === 'selection' ? (
          <>
            <View style={styles.warningBox}>
                <Text style={styles.warningText}>USE ONLY FOR GENUINE EMERGENCIES.</Text>
                <Text style={styles.warningSubText}>This will trigger lights on all wristbands.</Text>
            </View>
            
            {ALERT_TYPES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.alertCard} onPress={() => { setSelectedAlert(item); setStep('message'); }}>
                <item.icon color={item.color} size={32} />
                <View style={{ marginLeft: 15 }}>
                    <Text style={[styles.typeTitle, { color: item.color }]}>{item.id}</Text>
                    <Text style={styles.typeSub}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={[styles.alertCard, { borderColor: selectedAlert?.color, borderWidth: 1 }]}>
              {selectedAlert && <selectedAlert.icon color={selectedAlert.color} size={32} />}
              <View style={{ marginLeft: 15 }}>
                  <Text style={[styles.typeTitle, { color: selectedAlert?.color }]}>{selectedAlert?.id}</Text>
              </View>
            </View>
            
            <TextInput 
                style={styles.textArea} 
                multiline 
                placeholder="Enter alert details (e.g., location, instructions)..." 
                placeholderTextColor="#666" 
                value={alertMessage} 
                onChangeText={setAlertMessage} 
            />
            
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep('selection')}>
                  <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sendBtn, { backgroundColor: selectedAlert?.color }]} 
                onPress={handleSend}
              >
                  <Text style={[styles.btnText, { color: '#000' }]}>BROADCAST ALERT</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  screenTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginLeft: 20 },
  
  warningBox: { backgroundColor: '#330000', padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#FF4D4D' },
  warningText: { color: '#FF4D4D', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  warningSubText: { color: '#FF8888', textAlign: 'center', fontSize: 12, marginTop: 4 },
  
  alertCard: { backgroundColor: '#1A1A1A', flexDirection: 'row', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center' },
  typeTitle: { fontWeight: 'bold', fontSize: 18 },
  typeSub: { color: '#AAA', fontSize: 12, marginTop: 2 },
  
  textArea: { backgroundColor: '#1A1A1A', borderRadius: 15, height: 150, padding: 20, color: 'white', marginBottom: 20, textAlignVertical: 'top', fontSize: 16 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#333', padding: 15, borderRadius: 10, width: '35%', alignItems: 'center', justifyContent: 'center' },
  sendBtn: { padding: 15, borderRadius: 10, width: '60%', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 16, color: '#FFF' }
});