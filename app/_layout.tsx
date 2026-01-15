// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Mock auth check function (replace with real logic)
const checkUserLoggedIn = async () => {
  // Example: AsyncStorage.getItem('token') or API call
  return false; // default: not logged in
};

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const logged = await checkUserLoggedIn();
      setLoggedIn(logged);
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        // User is logged in → show tabs
        <Stack.Screen name="(tabs)/home" />
      ) : (
        // User not logged in → show login and register
        <>
          <Stack.Screen name="(auth)/index" />
          <Stack.Screen name="(auth)/register" />
        </>
      )}
    </Stack>
  );
}
