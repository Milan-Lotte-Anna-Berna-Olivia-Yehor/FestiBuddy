import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { auth } from "../firebase/firebaseConfig";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // 1. SLEDOVANIE STAVU PRIHLÁSENIA
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return subscriber; // Odhlásenie listenera pri unmount
  }, []);

  // 2. LOGIKA PRESMEROVANIA (OCHRANKÁR)
  useEffect(() => {
    if (initializing) return; // Kým nevieme, kto si, nerobíme nič

    // Zistíme, v ktorej skupine sa používateľ nachádza
    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "(auth-organizer)";
    const inTabsGroup = segments[0] === "(tabs)" || segments[0] === "(tabs-organizer)";
    const atWelcome = segments.length === 0 || segments[0] === "index";

    const checkRedirect = async () => {
      // A. POUŽÍVATEĽ NIE JE PRIHLÁSENÝ
      if (!user) {
        // Ak sa snaží dostať dovnútra appky (tabs), vykopneme ho na začiatok
        if (inTabsGroup) {
          router.replace("/");
        }
        // Ak je na Welcome alebo v Auth (login), necháme ho tam
      } 
      
      // B. POUŽÍVATEĽ JE PRIHLÁSENÝ
      else {
        // Zistíme rolu (či je organizátor alebo user)
        const role = await AsyncStorage.getItem("userRole");

        // Ak je na Login obrazovke alebo na Welcome, presmerujeme ho dnu
        if (inAuthGroup || atWelcome) {
          if (role === 'organizer') {
            router.replace("/(tabs-organizer)/home");
          } else {
            router.replace("/(tabs)/Home");
          }
        }
      }
    };

    checkRedirect();
  }, [user, initializing, segments]);

  // 3. LOADING OBRAZOVKA (Kým Firebase zisťuje status)
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#7CFF00" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        animation: 'fade',
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(tabs-organizer)" />
        
        {/* Modals */}
        <Stack.Screen 
          name="modalEvent" 
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen 
          name="modalSchedule" 
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}