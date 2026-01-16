import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Locker() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
      <View style={styles.container}>
        <Text style={styles.title}>Locker Information</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Festival Locker Services</Text>
          <Text style={styles.infoText}>
            Secure your belongings at our festival lockers. Available at multiple locations throughout the venue.
          </Text>
          <Text style={styles.infoText}>
            - Small lockers: $5/day
          </Text>
          <Text style={styles.infoText}>
            - Medium lockers: $10/day
          </Text>
          <Text style={styles.infoText}>
            - Large lockers: $15/day
          </Text>
          <Text style={styles.infoText}>
            Payment can be made via the app or at the locker stations.
          </Text>
        </View>


        <View style={styles.assignedLocker}>
          <Text style={styles.assignedTitle}>Assigned Locker</Text>
          <Text style={styles.lockerDetails}>Locker #123 - Small Size</Text>
          <Text style={styles.lockerDetails}>Location: Main Entrance</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={() => alert('Digital key sent! Locker unlocked.')}>
            <Text style={styles.unlockText}>Unlock</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
    color: '#fff',
  },
  infoContainer: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b0ff4b',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  lockerItem: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  lockerText: {
    color: '#fff',
    fontSize: 18,
  },
  assignedLocker: {
    width: '100%',
    padding: 15,
    marginTop: 20,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  assignedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b0ff4b',
    marginBottom: 10,
  },
  lockerDetails: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  unlockButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#b0ff4b',
    borderRadius: 8,
    alignItems: 'center',
  },
  unlockText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
