import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase/firebaseConfig';

export default function NotificationScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');

  const handleSend = async () => {
    if (!title || !message) {
      alert("Please fill in the fields?");
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        priority,
        type: 'standard',
        createdAt: serverTimestamp(),
      });
      alert("message sent")
      Alert.alert("Message Sent", "Notification broadcasted successfully!", [
        { text: "OK", onPress: () => {
          setTitle('');
          setMessage('');
          setPriority('Normal');
        }}
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to send notification.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><ArrowLeft color="white" size={30} /></TouchableOpacity>
          <Text style={styles.screenTitle}>Send Notification</Text>
        </View>

        <Text style={styles.label}>Notification Title</Text>
        <TextInput style={styles.input} placeholder="Artist reminder..." placeholderTextColor="#666" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Message</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Enter message..." placeholderTextColor="#666" value={message} onChangeText={setMessage} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}><Send color="black" size={20} /><Text style={styles.btnText}>Send</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  screenTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginLeft: 20 },
  label: { color: 'white', fontSize: 18, marginBottom: 10 },
  input: { backgroundColor: '#2A2A2A', borderRadius: 15, padding: 15, color: 'white', marginBottom: 20 },
  textArea: { height: 120, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelBtn: { backgroundColor: '#A9A9A9', padding: 15, borderRadius: 10, width: '45%', alignItems: 'center' },
  sendBtn: { backgroundColor: '#ADFF2F', padding: 15, borderRadius: 10, width: '45%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  btnText: { color: 'black', fontWeight: 'bold' }
});