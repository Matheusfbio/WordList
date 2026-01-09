import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { ref, onValue, set, push } from "firebase/database";
import { db } from "../../../firebaseConfig";
import { toastConfig } from "@/Components/CustomToast"; // Importando o CustomToast

interface Word {
  id: string;
  word: string;
  definition: string;
  phonetic: string;
  audioUrl?: string;
  translation?: string;
  type: "word" | "phrase";
}

export default function WordList() {
  const [selectedWord, setSelectbedWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const historyRef = ref(db, "history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      setHistory(data ? Object.values(data) : []);
    });
  }, []);

  const translateText = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|pt`
      );
      const data = await response.json();
      return data.responseData?.translatedText || "Tradução não disponível";
    } catch (error) {
      console.error("Erro na tradução:", error);
      return "Erro na tradução";
    }
  };

  const fetchWordDetails = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setWords([]);

    const isPhrase = searchTerm.includes(" ");

    try {
      if (isPhrase) {
        // Traduzir frase
        const translation = await translateText(searchTerm);
        const phraseData: Word = {
          id: searchTerm.toLowerCase().replace(/\s+/g, "-"),
          word: searchTerm,
          definition: translation,
          phonetic: "Frase traduzida",
          translation,
          type: "phrase",
        };

        setWords([phraseData]);

        // Salvar no histórico
        const newHistoryRef = push(ref(db, "history"));
        await set(newHistoryRef, {
          text: searchTerm,
          translation,
          phonetic: "Frase traduzida",
          type: "phrase",
        });
      } else {
        // Buscar palavra no dicionário
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
        );
        if (!response.ok) throw new Error("Essa palavra não existe");

        const data = await response.json();
        const fetchedWord: Word = {
          id: data[0].word,
          word: data[0].word,
          phonetic: data[0].phonetics?.[0]?.text || "Pronúncia não disponível",
          definition:
            data[0].meanings
              ?.flatMap((meaning: any) =>
                meaning.definitions.map((def: any) => def.definition)
              )
              ?.join("\n") || "Definição não disponível",
          audioUrl: data[0].phonetics?.find((p: any) => p.audio)?.audio || null,
          type: "word",
        };

        setWords([fetchedWord]);

        // Salvar no histórico
        const newHistoryRef = push(ref(db, "history"));
        await set(newHistoryRef, {
          text: fetchedWord.word,
          phonetic: fetchedWord.phonetic,
          type: "word",
        });
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (audioUrl?: string) => {
    if (!audioUrl) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  };

  const speakText = (text: string) => {
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const addToFavorites = async (word: Word) => {
    try {
      await set(ref(db, `favorites/${word.id}`), word);
      Toast.show({
        type: "success",
        text1: "Palavra adicionada aos favoritos!",
        visibilityTime: 2000,
        position: "bottom",
        // Identificador único para evitar conflitos
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar aos favoritos!",
        visibilityTime: 2000,
        position: "bottom",
        // Identificador único para evitar conflitos
      });
      console.error("Erro ao adicionar aos favoritos:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma palavra ou frase"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={fetchWordDetails}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWordDetails}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando palavras...</Text>
        </View>
      )}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.phonetic}>{item.phonetic}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
            {item.audioUrl && item.type === "word" && (
              <TouchableOpacity onPress={() => playAudio(item.audioUrl)}>
                <Text style={styles.audioText}>▶ Ouvir pronúncia</Text>
              </TouchableOpacity>
            )}
            {item.type === "phrase" && (
              <TouchableOpacity onPress={() => speakText(item.word)}>
                <Text style={styles.audioText}>▶ Ouvir frase</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => addToFavorites(item)}
            >
              <Text style={styles.favoriteButtonText}>
                Adicionar aos Favoritos
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Toast position="top" config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    alignItems: "center",
    marginVertical: 10,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phonetic: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 5,
  },
  definition: {
    fontSize: 14,
    marginTop: 5,
  },
  audioText: {
    color: "blue",
    marginTop: 5,
    fontSize: 14,
  },
  favoriteButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
