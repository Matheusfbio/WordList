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
import * as Speech from "expo-speech";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/Components/CustomToast";

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
  const [favorites, setFavorites] = useState<Word[]>([]);

  useEffect(() => {
    const favoritesRef = ref(db, "favorites");
    onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFavorites(Object.values(data) as Word[]);
      } else {
        setFavorites([]);
      }
    });
  }, []);

  const removeFromFavorites = async (wordId: string) => {
    try {
      await remove(ref(db, `favorites/${wordId}`));
      Toast.show({
        type: "success",
        text1: "Palavra removida dos favoritos!",
        visibilityTime: 2000,
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao remover dos favoritos!",
        visibilityTime: 2000,
        position: "bottom",
      });
      console.error("Erro ao remover dos favoritos:", error);
    }
  };

  const speakText = (text: string) => {
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {favorites.length > 0 ? (
          favorites.map((word) => (
            <View key={word.id} style={styles.wordContainer}>
              <Text style={styles.wordText}>{word.word}</Text>
              <Text style={styles.definition}>
                {word.type === "phrase" ? word.translation : word.definition}
              </Text>
              {word.type === "phrase" && (
                <TouchableOpacity onPress={() => speakText(word.word)}>
                  <Text style={styles.audioText}>▶ Ouvir frase</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromFavorites(word.id)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noFavorites}>Nenhuma palavra favorita</Text>
        )}
      </ScrollView>
      <Toast position="top" config={toastConfig} />
    </View>
  );
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
  audioText: {
    color: "blue",
    marginTop: 5,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
