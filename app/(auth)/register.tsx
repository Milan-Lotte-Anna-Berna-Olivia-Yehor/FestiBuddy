import { router } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import app from '../../firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
// import { auth } from "@/lib/firebase";
import { db } from '../../firebase/firebaseConfig';

const createUserDoc = async () => {
  const user = getAuth(app).currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    email: user.email,
    createdAt: new Date(),
    likedArtists: [],
  });
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  async function registerUser() {
    if (!email || !password || !userName) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    const auth = getAuth(app);

    try {
      // 1️⃣ Create user
      const response = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Set display name
      await updateProfile(response.user, { displayName: userName });
      await createUserDoc()

      setLoading(false);

      router.replace('/login')
      // 3️⃣ Show alert and navigate to login
      Alert.alert(
        'Success',
        'Account created successfully. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'), // Go to login screen
          },
        ]
      );
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Registration failed', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/firebase.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
        inputMode="email"
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Username"
        onChangeText={setUserName}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={registerUser}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: 'white' }}>Register</Text>
        )}
      </Pressable>

      <View style={styles.register}>
        <Text style={styles.link}>Already have an account? </Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={[styles.link, { color: 'teal' }]}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  link: { fontSize: 15, color: 'gray' },
  register: { marginTop: 25, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' },
  logo: { marginBottom: 40, width: 80, height: 80, alignSelf: 'center' },
  button: {
    width: '90%',
    height: 45,
    backgroundColor: 'teal',
    borderRadius: 6,
    marginTop: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 45,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
  },
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
});

