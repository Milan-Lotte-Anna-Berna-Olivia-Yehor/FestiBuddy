import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SosButton } from "@/components/SOSButton.native";

export default function SOS() {
  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      
      {/* TOP CONTENT */}
      <ThemedView style={{ gap: 16 }}>
        <ThemedText type="title">Emergency Assistance</ThemedText>

        <ThemedText>
          Use this button ONLY if you feel unsafe or need immediate help!
        </ThemedText>

        <ThemedText style={{ opacity: 0.8, fontSize: 13 }}>
          DO NOT send false or test SOS messages! Misuse may delay help for others
          who are in real danger!
        </ThemedText>

        <ThemedText style={{ opacity: 0.8, fontSize: 13 }}>
          After sending an SOS, STAY where you are and wait for assistance!
        </ThemedText>
      </ThemedView>

      {/* PUSH BUTTON TO BOTTOM */}
      <ThemedView style={{ flex: 2 }} />

      {/* SOS BUTTON AT BOTTOM */}
      <ThemedView style={{ alignItems: "center", paddingBottom: 16, marginBottom: 80 }}>
        <SosButton />
      </ThemedView>

    </ThemedView>
  );
}

