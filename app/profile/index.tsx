import { Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
      <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileSection}>
        <View style={styles.photoPlaceholder}></View>
        <Text style={styles.nameText}>username</Text>
        <View style={styles.visitorBadge}>
          <Text style={styles.visitorText}>Visitor</Text>
        </View>
      </View>

      {/* Buttons to subpages */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/pair_bracelet')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile_bracelet-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Pair Bracelet</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/notifications')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile_notification-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Notifications</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/friends')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile_friends-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Friends</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/settings')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile_settings-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Settings</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/wallet')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile_wallet-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Wallet</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/locker')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/map_lockers-removebg-preview.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text style={styles.buttonText}>Locker</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => alert('Logged out')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000', 
  },
  title: {
    fontSize: 28,
    marginBottom: 0,
    fontWeight: '600',
    color: '#fff', 
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#b0ff4b',
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#99f1ff',
    borderRadius: 10,
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  visitorBadge: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  visitorText: {
    color: '#b0ff4b',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 30,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
