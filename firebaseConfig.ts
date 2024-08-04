import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5N1IDqjNY8YF_0olRhqSO6gGr_Qa9XW0",
  authDomain: "pantry-cd52f.firebaseapp.com",
  projectId: "pantry-cd52f",
  storageBucket: "pantry-cd52f.appspot.com",
  messagingSenderId: "357606899624",
  appId: "1:357606899624:web:437e0e23f25f889168a79d",
  measurementId: "G-9GNZNDMJ4Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  // Initialize analytics only on the client side
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, analytics };
