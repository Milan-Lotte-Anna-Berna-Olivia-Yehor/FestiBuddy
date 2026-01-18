import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
// Ak máš vytvorený HapticTab (z predchádzajúcich krokov), použi ho pre vibrácie:
import { HapticTab } from "../../components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7CFF00", // Tvoja FestiBuddy zelená
        tabBarInactiveTintColor: "#666",
        // Pridá jemnú vibráciu pri prepínaní tabov (voliteľné)
        tabBarButton: HapticTab, 
        tabBarStyle: {
          position: 'absolute', // Nutné pre priesvitnosť
          borderTopWidth: 0,
          elevation: 0,
          height: 90, // Trochu vyšší tab bar vyzerá modernejšie
          backgroundColor: 'transparent', // Priesvitné pozadie
          paddingBottom: 30, // Priestor pre Home Indicator na iPhonoch
        },
        // TOTO ROBÍ MÁGIU (Blur Efekt):
        tabBarBackground: () => (
            Platform.OS === 'ios' ? (
                // iOS: Skutočný blur
                <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />
            ) : (
                // Android: Polopriesvitná tmavá vrstva (BlurView na Androide niekedy blbne)
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.95)' }} />
            )
        ),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="planet-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="map-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="personalTable"
        options={{
          title: "My Plan",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="calendar-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="chatbubble-ellipses-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="alert-circle" color="#FF0000" />,
          tabBarLabelStyle: { color: '#FF0000', fontWeight: 'bold' } // Červený text pre SOS
        }}
      />
    </Tabs>
  );
}