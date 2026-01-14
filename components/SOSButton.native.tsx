import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function SosButton() {
  const confirmSos = () => {
    // Browser (Expo Web) simulation
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to send an SOS message?"
      );

      if (confirmed) {
        window.alert(
          "Stay where you are! Emergency services are on the way!"
        );
      }

      return;
    }

    // Native fallback (will work on Android/iOS emulator later)
    console.log("SOS pressed (native)");
  };

  return (
    <Pressable
      onPress={confirmSos}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      hitSlop={12}
    >
      <View style={styles.emojiWrapper}>
        <Text style={styles.text}>🚨</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
  },
  pressed: {
    opacity: 1,
  },
  emojiWrapper: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: "white", // 👈 contrast
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 25,
  },
});

