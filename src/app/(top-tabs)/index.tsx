import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av"; // Importa o módulo de áudio do Expo

interface Word {
  id: string;
  word: string;
  definition: string;
  phonetic: string;
  synonyms?: string[];
  example?: string;
  audioUrl?: string | null;
}

const words: string[] = [
  "apple",
  "ant",
  "astronaut",
  "avocado",
  "argument",
  "art",
  "alarm",
  "address",
  "adventure",
  "adopt",
  "banana",
  "boat",
  "breeze",
  "book",
  "bird",
  "ball",
  "butterfly",
  "bicycle",
  "brick",
  "bloom",
  "car",
  "cat",
  "cloud",
  "cup",
  "calendar",
  "chocolate",
  "crayon",
  "camera",
  "castle",
  "candle",
  "dog",
  "dance",
  "dream",
  "door",
  "desk",
  "dinosaur",
  "dolphin",
  "doctor",
  "drum",
  "dragon",
  "elephant",
  "energy",
  "echo",
  "engine",
  "egg",
  "earth",
  "envelope",
  "education",
  "electricity",
  "experiment",
  "fish",
  "flower",
  "forest",
  "fan",
  "flag",
  "freedom",
  "friend",
  "fountain",
  "football",
  "feather",
  "grape",
  "guitar",
  "gold",
  "game",
  "giraffe",
  "glass",
  "garden",
  "glove",
  "group",
  "goal",
  "house",
  "happy",
  "hero",
  "hat",
  "hammer",
  "honey",
  "hippopotamus",
  "horizon",
  "heart",
  "history",
  "ice",
  "idea",
  "island",
  "illustration",
  "insect",
  "internet",
  "injury",
  "impact",
  "information",
  "intelligence",
  "jungle",
  "jump",
  "joy",
  "jacket",
  "jelly",
  "journey",
  "joke",
  "jog",
  "jewel",
  "juice",
  "kangaroo",
  "kite",
  "king",
  "key",
  "kitchen",
  "kiwi",
  "knight",
  "knowledge",
  "kingdom",
  "kettle",
  "lemon",
  "lamp",
  "laughter",
  "lake",
  "lawn",
  "light",
  "lunch",
  "leap",
  "lion",
  "language",
  "moon",
  "mountain",
  "magic",
  "mirror",
  "money",
  "magnet",
  "mango",
  "mountain",
  "mouse",
  "music",
  "night",
  "nature",
  "nest",
  "nose",
  "note",
  "needle",
  "nurse",
  "net",
  "nut",
  "neighbor",
  "ocean",
  "orange",
  "owl",
  "octopus",
  "office",
  "onion",
  "oasis",
  "orange",
  "outfit",
  "oxygen",
  "pencil",
  "planet",
  "peace",
  "paper",
  "penguin",
  "piano",
  "plumber",
  "parrot",
  "picture",
  "pool",
  "queen",
  "quiet",
  "quilt",
  "quarry",
  "question",
  "quick",
  "quiz",
  "quality",
  "quarter",
  "quota",
  "rainbow",
  "river",
  "rose",
  "rock",
  "robot",
  "rabbit",
  "roof",
  "race",
  "rug",
  "rain",
  "sun",
  "star",
  "snow",
  "sock",
  "sand",
  "snake",
  "school",
  "strawberry",
  "soup",
  "storm",
  "tree",
  "tiger",
  "travel",
  "table",
  "turtle",
  "train",
  "tooth",
  "television",
  "trophy",
  "telescope",
  "umbrella",
  "unicorn",
  "unity",
  "under",
  "uniform",
  "universe",
  "usual",
  "up",
  "urgent",
  "unaware",
  "violin",
  "volcano",
  "victory",
  "vase",
  "vampire",
  "village",
  "vision",
  "vacuum",
  "vulture",
  "vote",
  "water",
  "whale",
  "wonder",
  "wind",
  "waltz",
  "whistle",
  "world",
  "wood",
  "wallet",
  "wall",
  "xylophone",
  "x-ray",
  "xerox",
  "xenon",
  "xmas",
  "x-factor",
  "xenophobia",
  "xylophonist",
  "xenial",
  "xenopus",
  "yellow",
  "yoga",
  "youth",
  "yawn",
  "yoga",
  "yacht",
  "yolk",
  "yummy",
  "yarn",
  "year",
  "zebra",
  "zipper",
  "zoom",
  "zero",
  "zombie",
  "zone",
  "zinc",
  "zodiac",
  "zoo",
  "zeal",
];

export default function WordList() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Histórico do Firebase
  useEffect(() => {
    const historyRef = ref(db, "history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistory(Object.values(data) as string[]);
      } else {
        setHistory([]);
      }
    });
  }, []);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedRecent = await AsyncStorage.getItem("recentSearches");
        if (storedRecent) {
          setRecentSearches(JSON.parse(storedRecent));
        }
      } catch (error) {
        console.error("Erro ao carregar buscas recentes:", error);
      }
    };
    loadRecentSearches();
  }, []);

  // Cleanup do áudio
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const fetchWordDetails = async (word: string) => {
    setLoading(true);
    setError(null);

    try {
      const cachedData = await AsyncStorage.getItem(word);
      if (cachedData) {
        console.log(`Dados em cache para ${word}:`, cachedData);
        try {
          const parsedCache = JSON.parse(cachedData);
          setSelectedWord(parsedCache.data);
          setModalVisible(true);
          setLoading(false);
          return;
        } catch (e) {
          console.error(`Erro ao parsear cache para ${word}:`, e);
          await AsyncStorage.removeItem(word);
        }
      }

      // Requisição à API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} ${response.statusText}`
        );
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Resposta da API:", data);
        if (data.title && data.title === "No Definitions Found") {
          throw new Error("Essa palavra não existe");
        }
        // Extraindo URL de áudio e usando o mesmo método do History para phonetic:
        const audioUrl =
          data[0].phonetics?.find((p: any) => p.audio && p.audio.trim() !== "")
            ?.audio || null;
        const fetchedWord: Word = {
          id: data[0].word,
          word: data[0].word,
          phonetic: data[0].phonetics?.[0]?.text || "Pronúncia não disponível",
          definition:
            data[0].meanings
              ?.flatMap((meaning: any) =>
                meaning.definitions.map((def: any) => {
                  const definitionText = def.definition;
                  const exampleText = def.example
                    ? `Exemplo: ${def.example}`
                    : "";
                  return `${definitionText}\n${exampleText}`;
                })
              )
              ?.join("\n") || "Definição não disponível",
          synonyms: data[0].meanings?.flatMap(
            (meaning: any) => meaning.synonyms
          ),
          audioUrl,
        };

        // Atualiza Firebase e histórico
        await set(ref(db, `words/${fetchedWord.word}`), data);
        console.log("Dados enviados com sucesso para o Firebase!");
        await push(ref(db, "history"), fetchedWord.word);
        await AsyncStorage.setItem(
          word,
          JSON.stringify({ data: fetchedWord, timestamp: Date.now() })
        );

        try {
          const recentSearchesKey = "recentSearches";
          const storedRecent = await AsyncStorage.getItem(recentSearchesKey);
          let updatedRecent: string[] = storedRecent
            ? JSON.parse(storedRecent)
            : [];
          if (!updatedRecent.includes(fetchedWord.word)) {
            updatedRecent.unshift(fetchedWord.word);
            updatedRecent = updatedRecent.slice(0, 10);
            await AsyncStorage.setItem(
              recentSearchesKey,
              JSON.stringify(updatedRecent)
            );
            setRecentSearches(updatedRecent);
          }
        } catch (error) {
          console.error("Erro ao atualizar buscas recentes:", error);
        }

        setSelectedWord(fetchedWord);
        setModalVisible(true);
      } else {
        const text = await response.text();
        console.log("Resposta não-JSON da API:", text);
        throw new Error("Resposta inesperada da API (não JSON).");
      }
    } catch (err: any) {
      console.error("Erro ao buscar palavra:", err);
      setError(err.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (word: Word) => {
    try {
      await set(ref(db, `favorites/${word.word}`), word);
      Alert.alert("Palavra adicionada aos favoritos!");
    } catch (error) {
      Alert.alert(`Erro ao adicionar aos favoritos: ${error}`);
    }
  };

  const playSound = async () => {
    if (selectedWord && selectedWord.audioUrl) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: selectedWord.audioUrl,
        });
        setSound(newSound);
        await newSound.playAsync();
      } catch (error: any) {
        Alert.alert("Erro ao tocar áudio", error.message);
      }
    } else {
      Alert.alert("Áudio indisponível para esta palavra");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedWord(null);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word List</Text>
      <ScrollView style={styles.wordList}>
        <View style={styles.wordRow}>
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordButton}
              onPress={() => fetchWordDetails(word)}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && <ActivityIndicator size="large" />}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <ScrollView>
              {selectedWord && (
                <>
                  <View style={styles.Highlight}>
                    <Text style={styles.wordTitle}>{selectedWord.word}</Text>
                    <Text style={styles.phonetic}>{selectedWord.phonetic}</Text>
                  </View>
                  <Text style={styles.definition}>
                    {selectedWord.definition}
                  </Text>
                  {selectedWord.synonyms && (
                    <Text style={styles.synonyms}>
                      Sinônimos: {selectedWord.synonyms.join(", ")}
                    </Text>
                  )}
                  {selectedWord.audioUrl && (
                    <TouchableOpacity
                      onPress={playSound}
                      style={styles.playButton}
                    >
                      <Text style={styles.playButtonText}>Ouvir Pronúncia</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => addToFavorites(selectedWord)}
                    style={styles.favoriteButton}
                  >
                    <Text style={styles.favoriteButtonText}>
                      Adicionar aos Favoritos
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  wordList: {
    marginVertical: 20,
  },
  wordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  wordButton: {
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  wordText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  wordTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  phonetic: {
    fontSize: 18,
    fontStyle: "italic",
    marginVertical: 10,
    color: "#333",
  },
  definition: {
    fontSize: 16,
    marginVertical: 5,
  },
  synonyms: {
    fontSize: 16,
    marginVertical: 5,
    color: "#888",
  },
  playButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  favoriteButton: {
    backgroundColor: "gold",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "red",
  },
  historyList: {
    marginVertical: 10,
  },
  Highlight: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});
