import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Notifications() {
  const router = useRouter();
  const [read1, setRead1] = useState(false);
  const [read2, setRead2] = useState(false);
  const [read3, setRead3] = useState(false);

  return (
    <>
      <Stack.Screen options={{ title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false, headerLeft: () => null }} />
      <View style={styles.container}>
      {/* Page title */}
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.thinLine} />

      <View style={styles.headerRow}>
        <Text style={styles.unreadText}>3 unread notifications</Text>
        <TouchableOpacity onPress={() => { setRead1(true); setRead2(true); setRead3(true); }}>
          <Text style={styles.markReadText}>mark all as read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.thinLine} />

      <View style={[styles.notificationContainer, { backgroundColor: read1 ? '#000' : '#333' }]}>
        <TouchableOpacity onPress={() => setRead1(true)}>
          <Text style={styles.notificationTitle}>Artist reminder</Text>
          <Text style={styles.notificationDesc}>Coldplay performs in 15 minutes at main stage!</Text>
          <Text style={styles.timeAgo}>5 min ago</Text>
        </TouchableOpacity>
         <View style={styles.thinLine} />
      </View>

      <View style={[styles.notificationContainer, { backgroundColor: read2 ? '#000' : '#333' }]}>
        <TouchableOpacity onPress={() => setRead2(true)}>
          <Text style={styles.notificationTitle}>Friend request</Text>
          <Text style={styles.notificationDesc}>berna123 sent you a friend request!</Text>
          <Text style={styles.timeAgo}>10 min ago</Text>
        </TouchableOpacity>
        <View style={styles.thinLine} />
      </View>

      <View style={[styles.notificationContainer, { backgroundColor: read3 ? '#000' : '#333' }]}>
        <TouchableOpacity onPress={() => setRead3(true)}>
          <Text style={styles.notificationTitle}>Schedule change</Text>
          <Text style={styles.notificationDesc}>One Direction performance time updated to: 19:00!</Text>
          <Text style={styles.timeAgo}>15 min ago</Text>
        </TouchableOpacity>
        <View style={styles.thinLine} />
      </View>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  thinLine: {
    height: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 16,
  },
  markReadText: {
    color: '#b0ff4b',
    fontSize: 16,
  },
  notificationContainer: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 10,
  },
  notificationTitle: {
    color: '#b0ff4b',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  notificationDesc: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  timeAgo: {
    color: '#fff',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 5,
  },
});
