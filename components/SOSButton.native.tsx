import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  emoji: {
    fontSize: 50,
  },
  ring: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressedOpacity: {
    opacity: 0.8,
  },
});

export function SosButton() {
  const confirmSos = () => {
    // Browser (Expo Web) simulation
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to send an SOS message?"
      );

      if (confirmed) {
        window.alert("Stay where you are! Emergency services are on the way!");
      }
      return;
    }

    // Native fallback (will work on Android/iOS emulator later)
    console.log("SOS pressed (native)");
  };

  return (
    <Pressable onPress={confirmSos} hitSlop={16}>
      {({ pressed }) => (
        <Text
          style={[
            styles.emoji,
            pressed && styles.ring,
            pressed && styles.pressedOpacity,
            pressed && { transform: [{ scale: 1.15 }] },
          ]}
        >
          🚨
        </Text>
      )}
    </Pressable>
  );
}

