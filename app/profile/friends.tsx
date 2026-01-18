import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader"; // <--- Import

const friendsData = [
  { id: '1', name: 'Alex Johnson', status: 'At Main Stage', online: true, image: require('../../assets/images/home_profile-removebg-preview.png') },
  { id: '2', name: 'Sarah Connor', status: 'Offline', online: false, image: null },
  { id: '3', name: 'Mike Ross', status: 'At Chill Zone', online: true, image: null },
];

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Friends" rightIcon="person-add-outline" />

      <FlatList
        data={friendsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.friendCard}>
            <View style={styles.avatarContainer}>
               {/* Placeholder avatar ak nemame obrazok */}
               {item.image ? (
                 <Image source={item.image} style={styles.avatar} />
               ) : (
                 <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#FFF" />
                 </View>
               )}
               {item.online && <View style={styles.onlineDot} />}
            </View>
            
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={[styles.status, {color: item.online ? '#7CFF00' : '#666'}]}>
                    {item.status}
                </Text>
            </View>

            <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No friends yet. Add some!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  listContent: { padding: 20 },
  friendCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A',
    padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#333'
  },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#7CFF00', borderWidth: 2, borderColor: '#1A1A1A'
  },
  info: { flex: 1 },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 12, marginTop: 2 },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center'
  },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50 }
});