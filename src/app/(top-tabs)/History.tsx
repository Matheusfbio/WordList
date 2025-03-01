import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { ref, onValue } from "firebase/database";

interface HistoryProps {
  onSelectWord: (word: string) => void;
}

interface WordData {
  word: string;
  phonetic?: string;
  definition?: string;
}

const History: React.FC<HistoryProps> = ({ onSelectWord }) => {
  const [history, setHistory] = useState<WordData[]>([]);

  const fetchWordDetails = async (word: string): Promise<WordData> => {
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
        };
      }
    } catch (error) {
      console.error(`Erro ao buscar a palavra ${word}:`, error);
      // Alert.alert(`Erro ao buscar a palavra ${word}: ${error}`);
    }
    return {
      word,
      phonetic: "Não disponível",
      definition: "Definição não encontrada",
    };
  };

  useEffect(() => {
    const historyRef = ref(db, "history");
    const unsubscribe = onValue(historyRef, async (snapshot) => {
      const data = snapshot.val();
      console.log("🔥 Dados do Firebase:", data);

      if (data) {
        const words = Object.values(data) as string[];

        const detailedHistory = await Promise.all(words.map(fetchWordDetails));

        setHistory(detailedHistory.reverse());
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (history.length === 0) {
    return <Text style={styles.noHistory}>Nenhum histórico disponível</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico de Pesquisas</Text>
      <ScrollView>
        {history.map((wordData, index) => (
          <TouchableOpacity key={index} style={styles.historyItem} disabled>
            <Text style={styles.word}>{wordData.word}</Text>
            <Text style={styles.phonetic}>{wordData.phonetic}</Text>
            <Text style={styles.definition} numberOfLines={2}>
              {wordData.definition}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
    marginTop: 10,
  },
});

export default History;
