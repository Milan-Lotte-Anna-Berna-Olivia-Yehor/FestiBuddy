import { Artists } from "@/constants/artistList";
import { Events } from "@/constants/eventList";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PersonalTimetable() {
    const [likedArtists, setLikedArtists] = useState<number[] | null>(null);


    useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        const unsubscribeSnap = onSnapshot(userRef, snap => {
        if (snap.exists()) {
            const likes = snap.data()?.likedArtists || [];
            setLikedArtists(likes.map(Number));
        } else {
            setLikedArtists([]);
        }
        });

        // Cleanup snapshot listener when auth changes
        return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
    }, []);


    if (likedArtists === null) {
        return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
            <Text style={{ color: "#fff" }}>Loading your timetable...</Text>
        </SafeAreaView>
        );
    }

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
  

    // Filter events to only those with liked artists
    const myEvents = Events.filter(event =>
        event.artists.some(ar => likedArtists.includes(ar.id))
    );

    if (myEvents.length === 0) {
        return (
        <SafeAreaView style={styles.container}>
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
            You haven’t liked any artists yet.
            </Text>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {myEvents.map(event => (
            <View key={event.id} style={styles.event}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                {event.artists
                .filter(ar => likedArtists.includes(ar.id))
                .map(ar => {
                    const artist = Artists[ar.id];
                    return (
                    <View key={ar.id} style={styles.row}>
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
            </View>
            ))}
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  event: { marginBottom: 24, borderBottomWidth: 1, borderBottomColor: "#222" },
  eventTitle: { color: "#ff5fa2", fontSize: 20, fontWeight: "700", margin: 12 },
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  time: { color: "#aaa", width: 50, fontSize: 12 },
  avatar: { width: 48, height: 48, borderRadius: 6, marginHorizontal: 12 },
  artist: { flex: 1, color: "#fff", fontSize: 16 },
});
