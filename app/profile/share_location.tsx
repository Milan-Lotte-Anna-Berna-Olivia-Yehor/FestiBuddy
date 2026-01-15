import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ShareLocation() {
  const router = useRouter();
  const { friendName } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false, headerLeft: () => null }} />
      <View style={styles.container}>

        <Text style={styles.shareText}>Share your real time location with:</Text>

        <View style={styles.friendInfo}>
          <View style={styles.profilePic}></View>
          <Text style={styles.friendName}>{friendName || 'John Doe'}</Text>
        </View>

        <Image source={require('../../assets/images/friends_location-removebg-preview.png')} style={styles.locationIcon} />

        <Text style={styles.streetName}>Main Festival Street</Text>

        <TouchableOpacity style={styles.shareButton} onPress={() => alert('Location shared!')}>
          <Text style={styles.shareButtonText}>Share My Location</Text>
        </TouchableOpacity>
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
  shareText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: { 
    width: 70,
    height: 70,
    backgroundColor: '#87ceeb',
    borderRadius: 10,
    marginRight: 10,
  },
  friendName: {
    fontSize: 20,
    color: '#fff',
  },
  locationIcon: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  streetName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 50,
  },
  shareButton: {
    backgroundColor: '#b0ff4b',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shareButtonText: {
    color: '#2e2e2e',
    fontSize: 16,
  },
});