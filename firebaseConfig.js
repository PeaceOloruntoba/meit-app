import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP-uhwWxFg35xovNaTHKN5CsUJ9xCdebk",
  authDomain: "meit-2e0f1.firebaseapp.com",
  projectId: "meit-2e0f1",
  storageBucket: "meit-2e0f1.firebasestorage.app",
  messagingSenderId: "273927954366",
  appId: "1:273927954366:android:b3a50cb29c79311717e3ef",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
