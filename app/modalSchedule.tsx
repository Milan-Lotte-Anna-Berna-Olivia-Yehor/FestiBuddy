import { Artists } from "@/constants/artistList";
import { Events } from "@/constants/eventList";
import { useSearchParams } from "expo-router/build/hooks";
import { Scroll } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native";


export default function LineupScreen() {

  const params = useSearchParams();
  let event = Events.find(ev => ev.id.toString() === params.get("id"))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{event?.title}</Text>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {event?.artists.map(ar => {
            let artist = Artists[ar.id]
            return(
              <View style={styles.row}>
              <Text style={styles.time}>
                {ar.start_time} {"\n"} {ar.end_time}
              </Text>
              <Image
                source={require("@/assets/images/widebinkydog.png")}
                style={styles.avatar}
              />
              <Text style={styles.artist}>{artist.name}</Text>
              {/* <TouchableOpacity onPress={() => toggleLike(dateKey, ar.id)}>
                <Text style={{ color: item.liked ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
              </TouchableOpacity> */}
            </View>
            );
          })}
        </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#ff5fa2", fontSize: 24, fontWeight: "700", textAlign: "center", flex: 1 },
  row: { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: "#222" },
  time: { color: "#aaa", width: 50, fontSize: 12 },
  avatar: { width: 48, height: 48, borderRadius: 6, marginHorizontal: 12 },
  artist: { flex: 1, color: "#fff", fontSize: 16 },
});
