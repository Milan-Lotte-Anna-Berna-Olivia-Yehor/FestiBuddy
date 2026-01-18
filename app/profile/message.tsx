import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

const chats = [
  { id: '1', name: 'Alex', msg: 'See you at Main Stage!', time: 'Now', unread: true },
  { id: '2', name: 'Sarah', msg: 'Where are you?', time: '5m', unread: false },
];

export default function MessageScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Messages" rightIcon="create-outline" />

      <FlatList 
        data={chats}
        keyExtractor={i => i.id}
        contentContainerStyle={{padding: 20}}
        renderItem={({item}) => (
            <TouchableOpacity style={styles.chatItem}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={[styles.name, item.unread && {color: '#7CFF00'}]}>{item.name}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={[styles.msg, item.unread && {color: '#FFF', fontWeight: 'bold'}]}>{item.msg}</Text>
                </View>
            </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  chatItem: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  msg: { color: '#888', fontSize: 14 },
  time: { color: '#666', fontSize: 12 }
});