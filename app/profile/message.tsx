import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Message() {
  const router = useRouter();
  const { friendName } = useLocalSearchParams();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey!', sender: 'me' },
    { id: '2', text: 'Hi there!', sender: 'friend' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'me' }]);
      setInputText('');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
      <View style={styles.container}>
        <View style={styles.friendInfo}>
          <View style={styles.profilePic}></View>
          <Text style={styles.friendName}>{friendName || 'John Doe'}</Text>
        </View>

        <View style={styles.thinLine} />

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.friendMessage]}>
              <Text style={[styles.messageText, item.sender === 'friend' && { color: '#fff' }]}>{item.text}</Text>
            </View>
          )}
          style={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Image
              source={require('../../assets/images/send_message-removebg-preview.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#000',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profilePic: {
    width: 70,
    height: 70,
    backgroundColor: '#87ceeb',
    borderRadius: 10,
    marginRight: 10,
  },
  friendName: {
    fontSize: 18,
    color: '#fff',
  },
  thinLine: {
    height: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#b0ff4b',
    alignSelf: 'flex-end',
  },
  friendMessage: {
    backgroundColor: '#2e2e2e',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#111',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2e2e2e',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#b0ff4b',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
