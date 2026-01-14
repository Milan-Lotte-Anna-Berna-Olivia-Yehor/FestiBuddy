import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyCjhgy2MO9ecg-mZw2u1hm_naaP6y0C_94",
  authDomain: "festibuddy-ed60f.firebaseapp.com",
  projectId: "festibuddy-ed60f",
  storageBucket: "festibuddy-ed60f.firebasestorage.app",
  messagingSenderId: "524662060526",
  appId: "1:524662060526:web:565465b7c348d272d5caff",
  measurementId: "G-SJTVFWT9JM"
};
 
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 
export const db = getFirestore(app)
export default app;