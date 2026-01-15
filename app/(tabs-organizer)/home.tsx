import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, Calendar, UserCircle, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Firebase Imports
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const FestiBuddyAdmin = () => {
  const router = useRouter();
  const [activeVisitors, setActiveVisitors] = useState<number>(0);

  useEffect(() => {
    // Listen for users where isLoggedIn is true
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isLoggedIn', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveVisitors(snapshot.size);
    }, (error) => {
      console.error("Firebase Listener Error:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.logoText}>festibuddy</Text>
          <UserCircle color="#ADFF2F" size={32} />
        </View>

        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.cardContainer}>
          <View style={[styles.statusCard, styles.limeBg]}>
            <Users color="black" size={40} />
            <View style={styles.cardTextContent}>
              <Text style={styles.cardLabel}>Active visitors</Text>
              <Text style={styles.cardValue}>{activeVisitors}</Text>
            </View>
          </View>

          <View style={[styles.statusCard, styles.limeBg]}>
            <Calendar color="black" size={40} />
            <View style={styles.cardTextContent}>
              <Text style={styles.cardLabel}>Scheduled events</Text>
              <Text style={styles.cardValue}>15</Text>
              <Text style={styles.cardSubtext}>7 artists today</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/notification')}>
          <Bell color="#ADFF2F" size={28} />
          <View style={styles.actionTextContent}>
            <Text style={styles.actionLabel}>Send notification</Text>
            <Text style={styles.actionSubtext}>Broadcast to festival attendees</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/safetyAlert')}>
          <AlertTriangle color="#FF4D4D" size={28} />
          <View style={styles.actionTextContent}>
            <Text style={styles.actionLabel}>Send safety alert</Text>
            <Text style={styles.actionSubtext}>Emergency broadcast to all attendees</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  logoText: { color: '#ADFF2F', fontSize: 28, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  cardContainer: { gap: 15, marginBottom: 40 },
  statusCard: { flexDirection: 'row', padding: 20, borderRadius: 20, alignItems: 'center' },
  limeBg: { backgroundColor: '#ADFF2F' },
  cardTextContent: { marginLeft: 20 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#000' },
  cardValue: { fontSize: 18, color: '#000' },
  cardSubtext: { fontSize: 14, color: '#333' },
  sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  actionButton: { backgroundColor: '#222', flexDirection: 'row', padding: 20, borderRadius: 20, marginBottom: 15 },
  actionTextContent: { marginLeft: 15, flex: 1 },
  actionLabel: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  actionSubtext: { color: '#AAA', fontSize: 12, marginTop: 4 },
});

export default FestiBuddyAdmin;