import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { ref, onValue, remove } from "firebase/database";

interface Word {
  id: string;
  word: string;
  definition: string;
  phonetic: string;
  synonyms?: string[];
  example?: string;
  translation?: string;
  type?: "word" | "phrase";
}

export default function Favorites() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  wordContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  definition: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: "red",
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noFavorites: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
