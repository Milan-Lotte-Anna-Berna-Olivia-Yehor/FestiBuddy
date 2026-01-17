import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Privacy() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Privacy', 
          headerBackTitle: 'Settings', 
          headerStyle: { backgroundColor: '#000' }, 
          headerTintColor: '#fff', 
          headerTitleStyle: { color: '#fff' }, 
          headerShadowVisible: false 
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.text}>
            At FestiBuddy, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our festival app.
          </Text>

          <Text style={styles.subtitle}>Information We Collect</Text>
          <Text style={styles.text}>
            • Profile information (name, email, profile picture){'\n'}
            • Festival preferences and interests{'\n'}
            • Location data (only when you share your location with friends){'\n'}
            • Event schedules and favorites{'\n'}
            • Social connections and friend lists
          </Text>

          <Text style={styles.subtitle}>How We Use Your Information</Text>
          <Text style={styles.text}>
            • To personalize your festival experience{'\n'}
            • To help you connect with friends at the festival{'\n'}
            • To provide location-based features (with your consent){'\n'}
            • To send you important festival updates and notifications{'\n'}
            • To improve our app and services
          </Text>

          <Text style={styles.subtitle}>Data Security</Text>
          <Text style={styles.text}>
            We use industry-standard security measures to protect your personal information. Your data is encrypted and stored securely.
          </Text>

          <Text style={styles.subtitle}>Location Sharing</Text>
          <Text style={styles.text}>
            Location sharing is completely optional. You control who can see your location and can disable it at any time in your settings.
          </Text>

          <Text style={styles.subtitle}>Your Rights</Text>
          <Text style={styles.text}>
            You have the right to access, modify, or delete your personal information at any time through your account settings.
          </Text>

          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleDateString()}
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
  footerText: {
    fontSize: 14,
    color: '#888',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});
