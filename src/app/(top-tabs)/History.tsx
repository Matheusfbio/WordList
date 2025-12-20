import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

interface WordData {
  word: string;
  phonetic?: string;
  definition?: string;
  audioUrl?: string;
  translation?: string;
  type?: "word" | "phrase";
}

const History: React.FC = () => {
  const [history, setHistory] = useState<WordData[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  // const [selectedWord, setSelectedWord] = useState<WordData | null>(null);

  const fetchWordDetails = async (item: any): Promise<WordData> => {
    if (typeof item === "object" && item.type === "phrase") {
      return {
        word: item.text,
        phonetic: "Frase traduzida",
        definition: item.translation,
        translation: item.translation,
        type: "phrase",
      };
    }

    const word = typeof item === "string" ? item : item.text;

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        return {
          word,
          phonetic: data[0].phonetics?.[0]?.text || "Não disponível",
          definition:
            data[0].meanings?.[0]?.definitions?.[0]?.definition ||
            "Definição não encontrada",
          audioUrl: data[0].phonetics?.find((p: any) => p.audio)?.audio || null,
          type: "word",
        };
      }
    } catch (error) {
      console.error(`Erro ao buscar a palavra ${word}:`, error);
    }
    return {
      word,
      phonetic: "Não disponível",
      definition: "Definição não encontrada",
      type: "word",
    };
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

  useEffect(() => {
    const historyRef = ref(db, "history");
    const unsubscribe = onValue(historyRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.values(data);
        const detailedHistory = await Promise.all(items.map(fetchWordDetails));
        setHistory(detailedHistory.reverse());
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noHistory}>Nenhum histórico disponível</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {history.map((wordData, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => setSelectedWord(wordData)}
          >
            <Text style={styles.word}>{wordData.word}</Text>
            <Text style={styles.phonetic}>{wordData.phonetic}</Text>
            <Text style={styles.definition} numberOfLines={2}>
              {wordData.type === "phrase"
                ? wordData.translation
                : wordData.definition}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedWord && (
        <View style={styles.selectedWordContainer}>
          <Text style={styles.selectedTitle}>Palavra Selecionada:</Text>
          <Text style={styles.selectedWord}>{selectedWord.word}</Text>
          <Text style={styles.selectedPhonetic}>{selectedWord.phonetic}</Text>
          <Text style={styles.selectedDefinition}>
            {selectedWord.type === "phrase"
              ? selectedWord.translation
              : selectedWord.definition}
          </Text>
          {selectedWord.audioUrl && selectedWord.type === "word" && (
            <TouchableOpacity onPress={() => playAudio(selectedWord.audioUrl)}>
              <Text style={styles.audioText}>▶ Ouvir pronúncia</Text>
            </TouchableOpacity>
          )}
          {selectedWord.type === "phrase" && (
            <TouchableOpacity onPress={() => speakText(selectedWord.word)}>
              <Text style={styles.audioText}>▶ Ouvir frase</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
    borderRadius: 5,
  },
  word: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phonetic: {
    fontSize: 14,
    color: "#777",
  },
  definition: {
    fontSize: 14,
    color: "#555",
  },
  noHistory: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  selectedWordContainer: {
    marginTop: 10,
    marginBottom: 40,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  selectedWord: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  selectedPhonetic: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginTop: 5,
  },
  selectedDefinition: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
    lineHeight: 20,
  },
  audioText: {
    color: "blue",
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default History;
