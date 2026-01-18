import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";

const FAQs = [
  { q: "How do I pair my bracelet?", a: "Go to Profile > Pair Bracelet and follow the instructions." },
  { q: "Can I get a refund?", a: "Refunds are processed at the Info Point until 22:00." },
  { q: "Is there free Wi-Fi?", a: "Yes, use 'FestiBuddy_Guest' near Chill Zones." },
];

export default function HelpSupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Help & Support" />

      <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          
          {FAQs.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                  <Text style={styles.question}>{item.q}</Text>
                  <Text style={styles.answer}>{item.a}</Text>
              </View>
          ))}

          <Text style={[styles.title, {marginTop: 20}]}>Need more help?</Text>
          <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="chatbubbles" size={24} color="#000" />
              <Text style={styles.btnText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={24} color="#FFF" />
              <Text style={styles.callText}>Emergency Hotline</Text>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  title: { color: '#7CFF00', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  faqItem: { marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  question: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  answer: { color: '#CCC', fontSize: 14, lineHeight: 20 },
  contactBtn: { flexDirection: 'row', backgroundColor: '#7CFF00', padding: 18, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 },
  btnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  callBtn: { flexDirection: 'row', backgroundColor: '#333', padding: 18, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10 },
  callText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});