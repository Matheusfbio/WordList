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

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdxvae369zQ2g0wFORXD2c8wm6-DXm0Qg",
  authDomain: "wordlistenglish.firebaseapp.com",
  projectId: "wordlistenglish",
  databaseURL: "https://wordlistenglish-default-rtdb.firebaseio.com/",
  storageBucket: "wordlistenglish.firebasestorage.app",
  messagingSenderId: "7905655240",
  appId: "1:7905655240:web:1a0e2e8becbe95bf7a68fd",
  measurementId: "G-DB7DD9S70L",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore
const db = getDatabase(app);

// Exporte os métodos necessários para interagir com o Firestore
export { db, collection, addDoc, getDoc, getDocs };
