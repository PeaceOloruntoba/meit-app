import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import Constants from "expo-constants";

const firebaseApiKey = Constants.expoConfig?.extra?.firebaseApiKey;
const firebaseAuthDomain = Constants.expoConfig?.extra?.firebaseAuthDomain;
const firebaseProjectId = Constants.expoConfig?.extra?.firebaseProjectId;
const firebaseStorageBucket =
  Constants.expoConfig?.extra?.firebaseStorageBucket;
const firebaseMessagingSenderId =
  Constants.expoConfig?.extra?.firebaseMessagingSenderId;
const firebaseAppId = Constants.expoConfig?.extra?.firebaseAppId;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

let app;
if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
) {
  app = initializeApp(firebaseConfig);
} else {
  console.warn(
    "Firebase configuration is missing or incomplete in app.config.js/app.json"
  );
  // You might want to throw an error or handle this more gracefully in a production app
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const messaging = app ? getMessaging(app) : null;

export default app;
