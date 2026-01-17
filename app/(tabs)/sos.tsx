import { SosButton } from "@/components/SOSButton.native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet, View } from "react-native";

export default function SOS() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* RED ROUNDED SQUARE WITH TEXT */}
        <View style={styles.redSquare}>
          <ThemedText type="title" style={styles.title}>Emergency Assistance</ThemedText>

          <ThemedText style={styles.text}>
            Use this button ONLY if you feel unsafe or need immediate help!
          </ThemedText>

          <ThemedText style={styles.warningText}>
            DO NOT send false or test SOS messages! Misuse may delay help for others
            who are in real danger!
          </ThemedText>

          <ThemedText style={styles.warningText}>
            After sending an SOS, STAY where you are and wait for assistance!
          </ThemedText>
        </View>

        {/* SOS BUTTON BELOW SQUARE */}
        <View style={styles.buttonContainer}>
          <SosButton />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  redSquare: {
    backgroundColor: '#ff5757',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.95,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
