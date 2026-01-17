import { Artists } from "@/constants/artistList";
import { Events } from "@/constants/eventList";
import { auth, db } from "@/firebase/firebaseConfig";
import { useSearchParams } from "expo-router/build/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function LineupScreen() {

  const [likedArtists, setLikedArtists] = React.useState<number[]>([]);

  React.useEffect(() => {
    const loadLikes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setLikedArtists(snap.data()?.likedArtists || []);
      }
    };

    loadLikes();
  }, []);

  const toggleLike = async (artistId: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const isLiked = likedArtists.includes(artistId);

    let newLikes: number[];

    if (isLiked) {
      // Unlike
      newLikes = likedArtists.filter(id => id !== artistId);
    } else {
      // Like
      newLikes = [...likedArtists, artistId];
    }

    // Optimistic update
    setLikedArtists(newLikes);

    // Save to Firestore
    await setDoc(userRef, { likedArtists: newLikes }, { merge: true });
  };

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
                source={require("@/assets/images/artist.png")}
                style={styles.avatar}
              />
              <Text style={styles.artist}>{artist.name}</Text>
              <TouchableOpacity onPress={() => toggleLike(ar.id)}>
                <Text style={{ color: likedArtists.includes(ar.id) ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
              </TouchableOpacity>
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


