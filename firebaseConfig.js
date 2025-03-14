// firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getDatabase } from "firebase/database";
import Constants from "expo-constants";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.API_KEY,
  authDomain: Constants.expoConfig.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.PROJECT_ID,
  databaseURL: Constants.expoConfig.extra.DATABASE_URL,
  storageBucket: Constants.expoConfig.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.APP_ID,
  measurementId: Constants.expoConfig.extra.MEASUREMENT_ID,
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore
const db = getDatabase(app);

// Exporte os métodos necessários para interagir com o Firestore
export { db, collection, addDoc, getDoc, getDocs };
