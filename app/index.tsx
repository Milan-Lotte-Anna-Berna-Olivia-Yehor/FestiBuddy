import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  const selectRole = async (role: "visitor" | "organizer") => {
    await AsyncStorage.setItem("userRole", role);

    if (role === "visitor") {
      // PUSH namiesto REPLACE, aby fungovala šípka späť
      router.push("/(auth)/login"); 
    } else if (role === "organizer") {
      router.push("/(auth-organizer)/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to FestiBuddy</Text>
        <Text style={styles.subtitle}>
          Choose how you want to continue
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => selectRole("visitor")}
          activeOpacity={0.85}
        >
          <Ionicons name="people-outline" size={42} color="#7CFF00" />
          <Text style={styles.cardTitle}>I’m a visitor</Text>
          <Text style={styles.cardDescription}>
            Discover festivals, view schedules and connect with friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => selectRole("organizer")}
          activeOpacity={0.85}
        >
          <Ionicons name="briefcase-outline" size={42} color="#7CFF00" />
          <Text style={styles.cardTitle}>I’m an organizer</Text>
          <Text style={styles.cardDescription}>
            Manage festivals, program changes and engage with attendees
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333", // Jemný border pre lepší 'tech' vzhľad
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
    lineHeight: 20,
  },
});