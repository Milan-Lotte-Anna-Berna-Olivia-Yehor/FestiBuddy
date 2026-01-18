import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

const notifs = [
  { id: '1', title: 'Main Stage Alert', msg: 'Neon Lights starting in 15 mins!', time: '10m ago', icon: 'musical-notes' },
  { id: '2', title: 'Safety Warning', msg: 'Stay hydrated! Free water at Bar A.', time: '2h ago', icon: 'water' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Notifications" rightIcon="checkmark-done-outline" />

      <FlatList 
        data={notifs}
        keyExtractor={i => i.id}
        contentContainerStyle={{padding: 20}}
        renderItem={({item}) => (
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    {/* @ts-ignore */}
                    <Ionicons name={item.icon} size={24} color="#000" />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.msg}>{item.msg}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  card: {
    flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 12
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#7CFF00',
    justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  title: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  msg: { color: '#CCC', fontSize: 14, marginBottom: 8 },
  time: { color: '#666', fontSize: 12 }
});