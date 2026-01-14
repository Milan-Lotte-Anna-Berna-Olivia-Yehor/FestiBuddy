import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: "AIzaSyCjhgy2MO9ecg-mZw2u1hm_naaP6y0C_94",
  authDomain: "festibuddy-ed60f.firebaseapp.com",
  projectId: "festibuddy-ed60f",
  storageBucket: "festibuddy-ed60f.firebasestorage.app",
  messagingSenderId: "524662060526",
  appId: "1:524662060526:web:31b1638688a63a85d5caff",
  measurementId: "G-KTV8S7SCV3"
};
 
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 
export default app;