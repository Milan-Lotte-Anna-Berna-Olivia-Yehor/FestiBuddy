// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
 
// const firebaseConfig = {
//   apiKey: "AIzaSyCjhgy2MO9ecg-mZw2u1hm_naaP6y0C_94",
//   authDomain: "festibuddy-ed60f.firebaseapp.com",
//   projectId: "festibuddy-ed60f",
//   storageBucket: "festibuddy-ed60f.firebasestorage.app",
//   messagingSenderId: "524662060526",
//   appId: "1:524662060526:web:565465b7c348d272d5caff",
//   measurementId: "G-SJTVFWT9JM"
// };
 
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
 
// export const db = getFirestore(app)
// export default app;

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyCjhgy2MO9ecg-mZw2u1hm_naaP6y0C_94",
  authDomain: "festibuddy-ed60f.firebaseapp.com",
  projectId: "festibuddy-ed60f",
  storageBucket: "festibuddy-ed60f.firebasestorage.app",
  messagingSenderId: "524662060526",
  appId: "1:524662060526:web:565465b7c348d272d5caff",
  measurementId: "G-SJTVFWT9JM",
};
 
// ✅ Prevent re-initializing during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
 
// ✅ Firestore is safe everywhere
export const db = getFirestore(app);
 
// ✅ Analytics is web-only (avoid "window is not defined")
export const analytics =
  typeof window !== "undefined"
    ? // require() so it’s only loaded in the browser
      require("firebase/analytics").getAnalytics(app)
    : null;
 
export default app;