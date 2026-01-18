import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSmartResponse } from "../../constants/chatbotData";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "Pair Bracelet ⌚",
  "Where is WC? 🚽",
  "Lineup Info 🎵",
  "SOS Help 🚨",
  "Lost & Found 🎒",
  "Upcoming Festivals 📅",
];

export default function ChatbotScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Festival Buddy 🤖. I can help you with pairing your bracelet, finding stages, or safety info. Just ask!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    
    // Simulácia odozvy
    setTimeout(() => {
      // Použijeme našu novú smart funkciu
      const botResponseText = getSmartResponse(text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000); 
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages, isTyping]);

  const QuickChip = ({ label }: { label: string }) => (
    <TouchableOpacity 
      style={styles.chip} 
      onPress={() => sendMessage(label)}
    >
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.botIconContainer}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </View>
        <View>
           <Text style={styles.headerTitle}>Festival Assistant</Text>
           <Text style={styles.headerStatus}>• Online</Text>
        </View>
      </View>

      {/* CHAT AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => (
          <View style={[
            styles.bubbleWrapper, 
            item.sender === 'user' ? styles.userWrapper : styles.botWrapper
          ]}>
            {item.sender === 'bot' && (
               <View style={styles.botAvatar}>
                  <Ionicons name="logo-android" size={16} color="#FFF" />
               </View>
            )}
            <View style={[
              styles.bubble,
              item.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userText : styles.botText
              ]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
            isTyping ? (
                <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>Buddy is typing...</Text>
                    <View style={styles.typingDot} />
                </View>
            ) : <View style={{height: 20}} />
        }
      />

      {/* INPUT AREA FIX */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // Toto zabezpečí, že input bude NAD TabBarom (cca 90px je výška tab baru)
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.keyboardContainer}
      >
        <View style={styles.inputWrapper}>
            
            {/* QUICK CHIPS (Scrollable) */}
            <View style={styles.chipsWrapper}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}
                >
                    {QUICK_QUESTIONS.map((q, index) => (
                        <QuickChip key={index} label={q} />
                    ))}
                </ScrollView>
            </View>

            {/* TEXT INPUT FIELD */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => sendMessage(inputText)}
                returnKeyType="send"
              />
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <Ionicons name="arrow-up" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            {/* EXTRA SPACER NA SPODKU PRE TAB BAR */}
            <View style={{ height: 10 }} /> 
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A', backgroundColor: '#000', zIndex: 10,
  },
  botIconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#7CFF00',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerStatus: { color: '#7CFF00', fontSize: 12, fontWeight: '600' },
  
  chatContent: { padding: 20, paddingBottom: 40 }, // Viac miesta dole
  
  bubbleWrapper: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-end' },
  userWrapper: { justifyContent: 'flex-end' },
  botWrapper: { justifyContent: 'flex-start' },
  
  botAvatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 4,
  },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#7CFF00', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#1A1A1A', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#333' },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#000', fontWeight: '600' },
  botText: { color: '#FFF' },

  typingIndicator: { marginLeft: 50, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  typingText: { color: '#666', fontSize: 12, fontStyle: 'italic', marginRight: 4 },
  typingDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#7CFF00' },

  // --- INPUT AREA STYLES ---
  keyboardContainer: {
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    backgroundColor: '#000', // Pozadie input časti
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    // Dôležité: Toto zabezpečí, že input bude "plávať" nad TabBarom
    paddingBottom: 85, 
  },

  chipsWrapper: { paddingVertical: 12 },
  chipsContainer: { paddingHorizontal: 16, gap: 8 },
  chip: {
    backgroundColor: '#1A1A1A', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, borderWidth: 1, borderColor: '#333',
  },
  chipText: { color: '#FFF', fontSize: 13, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
  },
  input: {
    flex: 1, backgroundColor: '#1A1A1A', borderRadius: 24, paddingHorizontal: 20,
    paddingVertical: 12, color: '#FFF', fontSize: 16, marginRight: 10,
    borderWidth: 1, borderColor: '#333',
  },
  sendButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#7CFF00',
    justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#333', opacity: 0.5 }
});