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

  const removeFromFavorites = async (word: string) => {
    try {
      await remove(ref(db, `favorites/${word}`));
      Alert.alert("Palavra removida dos favoritos!");
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <ScrollView>
        {favorites.length > 0 ? (
          favorites.map((word) => (
            <View key={word.id} style={styles.wordContainer}>
              <Text style={styles.wordText}>{word.word}</Text>
              <Text style={styles.definition}>{word.definition}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromFavorites(word.word)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noFavorites}>Nenhuma palavra favorita</Text>
        )}
      </ScrollView>
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
});
