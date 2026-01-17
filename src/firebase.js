import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth };
