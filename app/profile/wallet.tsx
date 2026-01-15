import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Wallet() {
  const router = useRouter();
  const [balance, setBalance] = useState(50.00); // Simulated balance from Firebase

  const handlePayment = () => {
    if (balance >= 5) {
      setBalance(balance - 5); // Deduct 5 credits
      alert('Payment successful! Wristband light effect activated.');
    } else {
      alert('Insufficient credits.');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Wallet', headerBackTitle: 'Profile', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false, headerLeft: () => null }} />
      <View style={styles.container}>
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.walletItem} onPress={handlePayment}>
          <Text style={styles.walletText}>Make Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletItem} onPress={() => router.push('/profile/transactions')}>
          <Text style={styles.walletText}>View Transactions</Text>
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
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    color: '#b0ff4b',
    fontWeight: 'bold',
  },
  walletItem: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
  },
  walletText: {
    color: '#fff',
    fontSize: 18,
  },
});
