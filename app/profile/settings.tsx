import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/profile/privacy')}
        >
          <View style={styles.settingRow}>
          <Text style={styles.settingText}>Privacy</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/profile/account')}
        >
          <View style={styles.settingRow}>
          <Text style={styles.settingText}>Account</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/profile/help-support')}
        >
          <View style={styles.settingRow}>
          <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/profile/offline-content')}
        >
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Offline Content</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
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
  settingItem: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    color: '#fff',
    fontSize: 18,
  },
  arrow: {
    color: '#888',
    fontSize: 24,
    fontWeight: '300',
  },
});
