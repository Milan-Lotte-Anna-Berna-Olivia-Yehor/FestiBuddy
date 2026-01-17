import { Stack, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpSupport() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@festibuddy.com');
  };

  const handleFAQPress = () => {
    // Could navigate to FAQ screen if it exists
    alert('FAQ section coming soon!');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support', 
          headerBackTitle: 'Settings', 
          headerStyle: { backgroundColor: '#000' }, 
          headerTintColor: '#fff', 
          headerTitleStyle: { color: '#fff' }, 
          headerShadowVisible: false 
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <Text style={styles.text}>
            We're here to help you make the most of your festival experience with FestiBuddy!
          </Text>

          <Text style={styles.subtitle}>Frequently Asked Questions</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>How do I find my friends at the festival?</Text>{'\n'}
            Use the "Share Location" feature to let friends see where you are, or use the map to find them.
          </Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>How do I pair my festival bracelet?</Text>{'\n'}
            Go to the "Pair Bracelet" section in your profile and follow the instructions to connect your wristband.
          </Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>Can I use the app offline?</Text>{'\n'}
            Yes! You can download schedules and maps for offline use. Go to Settings to manage offline content.
          </Text>

          <Text style={styles.text}>
            <Text style={styles.bold}>How do I report a problem?</Text>{'\n'}
            Use the SOS feature for emergencies, or contact support through the options below.
          </Text>

          <Text style={styles.subtitle}>Contact Support</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactText}>
              Need help? Reach out to our support team:{' '}
            </Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.emailLink}>support@festibuddy.com</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Emergency Help</Text>
          <Text style={styles.text}>
            For emergencies at the festival, use the SOS feature in the app or contact festival security directly.
          </Text>

          <Text style={styles.subtitle}>App Features</Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Schedule:</Text> View and manage your festival schedule{'\n'}
            • <Text style={styles.bold}>Map:</Text> Navigate the festival grounds{'\n'}
            • <Text style={styles.bold}>Chatbot:</Text> Get instant answers to festival questions{'\n'}
            • <Text style={styles.bold}>SOS:</Text> Quick access to emergency services{'\n'}
            • <Text style={styles.bold}>Friends:</Text> Connect and find your festival crew{'\n'}
            • <Text style={styles.bold}>Wallet:</Text> Manage your festival payments
          </Text>

          <Text style={styles.subtitle}>Tips for Best Experience</Text>
          <Text style={styles.text}>
            • Keep your app updated for the latest features{'\n'}
            • Enable notifications for important updates{'\n'}
            • Share your location with trusted friends only{'\n'}
            • Charge your phone and bring a portable charger{'\n'}
            • Download offline content before arriving at the festival
          </Text>

          <Text style={styles.footerText}>
            Version 1.0.0{'\n'}
            © 2024 FestiBuddy
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
  bold: {
    fontWeight: '600',
    color: '#fff',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0',
  },
  emailLink: {
    fontSize: 16,
    color: '#b0ff4b',
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});
