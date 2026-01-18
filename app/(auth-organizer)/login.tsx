import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase/firebaseConfig";

// HARDCODED MASTER KEY
const ORGANIZER_KEY = "festibuddy";

export default function OrganizerLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState(""); // Nový state pre kľúč
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !accessKey) {
      Alert.alert("Missing Info", "Please fill in email, password, and the organizer key.");
      return;
    }

    // 1. Overenie Kľúča (Lokálne) - Najrýchlejší check
    if (accessKey !== ORGANIZER_KEY) {
      Alert.alert("Access Denied", "Invalid Organizer Key.");
      return;
    }

    setLoading(true);
    try {
      // 2. Overenie účtu cez Firebase (môže to byť aj bežný user účet)
      await signInWithEmailAndPassword(auth, email, password);
      
      // 3. Úspech -> Uložíme rolu a ideme dnu
      await AsyncStorage.setItem("token", "organizer-dummy-token");
      await AsyncStorage.setItem("userRole", "organizer");
      
      router.replace("/(tabs-organizer)/home");
      
    } catch (error: any) {
      Alert.alert("Login Failed", "Could not authenticate with Firebase. Check your email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
             <Image 
                source={require("../../assets/images/app_logo-removebg-preview.png")}
                style={styles.logo}
                resizeMode="contain"
             />
             <View style={styles.badge}>
                <Text style={styles.badgeText}>ORGANIZER MODE</Text>
             </View>
          </View>
          
          <Text style={styles.title}>Command Center</Text>
          <Text style={styles.subtitle}>Enter credentials to access crowd control</Text>

          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Admin Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* ORGANIZER KEY - ŠPECIÁLNE POLE */}
            <View style={[styles.inputContainer, styles.keyContainer]}>
              <Ionicons name="key" size={20} color="#7CFF00" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: '#7CFF00', fontWeight: 'bold' }]}
                placeholder="Organizer Key"
                placeholderTextColor="rgba(124, 255, 0, 0.5)"
                value={accessKey}
                onChangeText={setAccessKey}
                secureTextEntry // Aby to nebolo vidno
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Authorize Access</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 20,
  },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center", paddingBottom: 100 },
  
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 220, height: 90 },
  badge: {
    backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1, borderColor: '#7CFF00', marginTop: -10
  },
  badgeText: { color: '#7CFF00', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  title: { fontSize: 28, fontWeight: "bold", color: "#FFF", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center", marginBottom: 40 },
  
  form: { gap: 16 },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1A1A1A",
    borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: "#333",
  },
  keyContainer: { borderColor: '#7CFF00', backgroundColor: 'rgba(124, 255, 0, 0.05)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
  
  button: {
    backgroundColor: "#7CFF00", height: 56, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginTop: 8,
    shadowColor: "#7CFF00", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
  },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});