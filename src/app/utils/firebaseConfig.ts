import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOSoA6-P1A-xsecSZbfiGpujy1K-OM4go",
  authDomain: "meit-2e0f1.firebaseapp.com",
  projectId: "meit-2e0f1",
  storageBucket: "meit-2e0f1.firebasestorage.app",
  messagingSenderId: "273927954366",
  appId: "1:273927954366:web:2ba9fbc111eaa93f17e3ef",
  measurementId: "G-T39PKY593B",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // ✅ Just this is enough
export const db = getFirestore(app);

export default firebaseConfig;
