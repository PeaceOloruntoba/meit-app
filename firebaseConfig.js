// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBP-uhwWxFg35xovNaTHKN5CsUJ9xCdebk", // Replace with your actual API key
  authDomain: "meit-2e0f1.firebaseapp.com",
  projectId: "meit-2e0f1",
  storageBucket: "meit-2e0f1.firebasestorage.app",
  messagingSenderId: "273927954366",
  appId: "1:273927954366:android:b3a50cb29c79311717e3ef",
  // databaseURL: "YOUR_DATABASE_URL", // If you plan to use Realtime Database
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
