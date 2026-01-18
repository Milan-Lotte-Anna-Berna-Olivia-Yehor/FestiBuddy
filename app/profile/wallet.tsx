import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Wallet & Top-up" rightIcon="time-outline" />

      <View style={styles.content}>
        <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>€ 45.50</Text>
        </View>

        <TouchableOpacity style={styles.topUpButton}>
            <Ionicons name="add-circle" size={24} color="#000" />
            <Text style={styles.topUpText}>Top Up Balance</Text>
        </TouchableOpacity>
        
        {/* Transaction History Placeholder */}
        <Text style={styles.historyTitle}>Recent Transactions</Text>
        <View style={styles.transactionItem}>
            <View style={styles.transIcon}><Ionicons name="beer" size={20} color="#FFF"/></View>
            <View style={{flex:1}}>
                <Text style={styles.transTitle}>Beer & Burger</Text>
                <Text style={styles.transTime}>Today, 14:30</Text>
            </View>
            <Text style={styles.transAmount}>- €12.50</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  balanceCard: {
    backgroundColor: '#1A1A1A', borderRadius: 24, padding: 30, alignItems: 'center',
    marginBottom: 20, borderWidth: 1, borderColor: '#333'
  },
  balanceLabel: { color: '#888', fontSize: 16, marginBottom: 8 },
  balanceValue: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
  
  topUpButton: {
    backgroundColor: '#7CFF00', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 18, borderRadius: 16, marginBottom: 40, gap: 10
  },
  topUpText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

  historyTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#111', borderRadius: 16, marginBottom: 10 },
  transIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  transTime: { color: '#666', fontSize: 12 },
  transAmount: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});