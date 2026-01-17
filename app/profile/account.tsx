import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Account() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Account', 
          headerBackTitle: 'Settings', 
          headerStyle: { backgroundColor: '#000' }, 
          headerTintColor: '#fff', 
          headerTitleStyle: { color: '#fff' }, 
          headerShadowVisible: false 
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Account Management</Text>
          <Text style={styles.text}>
            Manage your FestiBuddy account settings and preferences here.
          </Text>

          <Text style={styles.subtitle}>Profile Information</Text>
          <Text style={styles.text}>
            • Update your display name and profile picture{'\n'}
            • Change your email address{'\n'}
            • Update your festival preferences{'\n'}
            • Manage your bio and interests
          </Text>

          <Text style={styles.subtitle}>Account Security</Text>
          <Text style={styles.text}>
            • Change your password{'\n'}
            • Enable two-factor authentication{'\n'}
            • Manage connected devices{'\n'}
            • View login history
          </Text>

          <Text style={styles.subtitle}>Festival Preferences</Text>
          <Text style={styles.text}>
            • Set your favorite music genres{'\n'}
            • Choose notification preferences{'\n'}
            • Manage event reminders{'\n'}
            • Customize your festival schedule view
          </Text>

          <Text style={styles.subtitle}>Social Settings</Text>
          <Text style={styles.text}>
            • Manage friend requests{'\n'}
            • Control who can see your profile{'\n'}
            • Adjust location sharing settings{'\n'}
            • Manage blocked users
          </Text>

          <Text style={styles.subtitle}>Data & Storage</Text>
          <Text style={styles.text}>
            • View your account data{'\n'}
            • Download your data{'\n'}
            • Clear cache and temporary files{'\n'}
            • Manage offline content
          </Text>

          <Text style={styles.subtitle}>Delete Account</Text>
          <Text style={styles.text}>
            If you wish to delete your account, you can do so from this section. This action is permanent and cannot be undone.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#fff',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0',
    marginBottom: 16,
  },
});
