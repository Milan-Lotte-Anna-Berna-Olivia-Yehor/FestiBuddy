import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Transactions() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Transactions', headerBackTitle: 'Wallet', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false, headerLeft: () => null }} />
      <View style={styles.container}>
        <Text style={styles.title}>Transaction History</Text>

        <View style={styles.transactionItem}>
          <Text style={styles.transactionText}>Merchandise - $15.00</Text>
          <Text style={styles.transactionDate}>Jan 10, 2026</Text>
        </View>

        <View style={styles.transactionItem}>
          <Text style={styles.transactionText}>Added Funds - $50.00</Text>
          <Text style={styles.transactionDate}>Jan 5, 2026</Text>
        </View>

        <View style={styles.transactionItem}>
          <Text style={styles.transactionText}>Locker Rental - $5.00</Text>
          <Text style={styles.transactionDate}>Jan 3, 2026</Text>
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
  transactionItem: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  transactionText: {
    color: '#fff',
    fontSize: 16,
  },
  transactionDate: {
    color: '#b0ff4b',
    fontSize: 14,
    marginTop: 5,
  },
});