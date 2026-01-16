import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasRole, setHasRole] = useState(false);

  // Role-aware state: "visitor" | "organizer" | null
  const [userRole, setUserRole] = useState<"visitor" | "organizer" | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("userRole"); // "visitor" or "organizer"

        setIsLoggedIn(!!token);
        setUserRole(role as "visitor" | "organizer" | null);
        setHasRole(!!role);
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
        setIsLoggedIn(false);
        setHasRole(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* No role set yet → show welcome screen */}
      {!hasRole && <Stack.Screen name="index" />}

      {/* Role set but not logged in → show role-specific auth */}
      {hasRole && !isLoggedIn && (
        <Stack.Screen
          name={userRole === "organizer" ? "(auth-organizer)" : "(auth)"}
        />
      )}

      {/* Role set and logged in → show role-specific tabs */}
      {hasRole && isLoggedIn && (
        <Stack.Screen
          name={userRole === "organizer" ? "(tabs-organizer)" : "(tabs)"}
        />
      )}

      <Stack.Screen name="modalEvent" options={{headerShown: true, title: "", headerStyle: { backgroundColor: '#000' }, headerTintColor: "#ffffff"}}/>
      <Stack.Screen name="modalSchedule" options={{headerShown: true, title: "", headerStyle: { backgroundColor: '#000' }, headerTintColor: "#ffffff"}}/>
    </Stack>
  );
}


