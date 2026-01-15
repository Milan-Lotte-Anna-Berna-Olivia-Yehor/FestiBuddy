import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CloudRain, DoorOpen, ShieldAlert, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase/firebaseConfig';

const ALERT_TYPES = [
  { id: 'Weather Alert', sub: 'Severe weather conditions', icon: CloudRain, color: '#FFB347' },
  { id: 'Security Alert', sub: 'Security related incident', icon: ShieldAlert, color: '#FF4D4D' },
  { id: 'Evacuation Notice', sub: 'Immediate evacuation required', icon: DoorOpen, color: '#FF4D4D' },
  { id: 'Lost Person', sub: 'Missing person announcement', icon: Users, color: '#FFB347' },
];

export default function SafetyAlertScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'selection' | 'message'>('selection');
  const [selectedAlert, setSelectedAlert] = useState<typeof ALERT_TYPES[0] | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSend = async () => {
    if (!alertMessage.trim()) return Alert.alert("Error", "Enter a message");

    try {
      await addDoc(collection(db, 'notifications'), {
        title: selectedAlert?.id,
        message: alertMessage,
        type: 'safety',
        createdAt: serverTimestamp(),
      });

      Alert.alert("Message Sent", "The safety alert has been broadcasted!", [
        { text: "OK", onPress: () => {
          setAlertMessage('');
          setStep('selection');
          router.back();
        }}
      ]);
    } catch (e) { Alert.alert("Error", "Failed to send alert."); }
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
            <View style={styles.warningBox}><Text style={styles.warningText}>Use only for genuine emergencies.</Text></View>
            {ALERT_TYPES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.alertCard} onPress={() => { setSelectedAlert(item); setStep('message'); }}>
                <item.icon color={item.color} size={32} />
                <View style={{ marginLeft: 15 }}><Text style={styles.typeTitle}>{item.id}</Text><Text style={styles.typeSub}>{item.sub}</Text></View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.alertCard}>
              {selectedAlert && <selectedAlert.icon color={selectedAlert.color} size={32} />}
              <View style={{ marginLeft: 15 }}><Text style={styles.typeTitle}>{selectedAlert?.id}</Text></View>
            </View>
            <TextInput style={styles.textArea} multiline placeholder="Enter alert message..." placeholderTextColor="#666" value={alertMessage} onChangeText={setAlertMessage} />
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep('selection')}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}><Text style={styles.btnText}>Send the alert</Text></TouchableOpacity>
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
  warningBox: { backgroundColor: '#FF4D4D', padding: 20, borderRadius: 15, marginBottom: 20 },
  warningText: { color: 'black', fontWeight: 'bold', textAlign: 'center' },
  alertCard: { backgroundColor: '#2A2A2A', flexDirection: 'row', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center' },
  typeTitle: { color: 'white', fontWeight: 'bold' },
  typeSub: { color: '#AAA', fontSize: 12 },
  textArea: { backgroundColor: '#2A2A2A', borderRadius: 15, height: 150, padding: 20, color: 'white', marginBottom: 20, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { backgroundColor: '#A9A9A9', padding: 15, borderRadius: 10, width: '45%', alignItems: 'center' },
  sendBtn: { backgroundColor: '#ADFF2F', padding: 15, borderRadius: 10, width: '50%', alignItems: 'center' },
  btnText: { color: 'black', fontWeight: 'bold' }
});