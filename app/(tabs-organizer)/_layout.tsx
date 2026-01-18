import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
// Ak máš BlurView nainštalované (podľa predchádzajúcich krokov), použi ho aj tu:
import { BlurView } from "expo-blur";

export default function OrganizerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7CFF00",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          backgroundColor: 'transparent',
          paddingBottom: 30,
        },
        tabBarBackground: () => (
            Platform.OS === 'ios' ? (
                <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />
            ) : (
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.95)' }} />
            )
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Command Center",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="grid-outline" color={color} />,
        }}
      />
      
      {/* NOVÝ TAB - SYSTEM SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "System",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}