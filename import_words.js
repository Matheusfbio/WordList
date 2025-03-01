import { ref, set, get } from "firebase/database";
import fs from "fs";
import { db } from "./firebaseConfig.js";

// 📥 Ler JSON
const data = JSON.parse(fs.readFileSync("words_dictionary.json", "utf8"));

// 🚀 Inserir no Realtime Database sem sobrescrever existentes
(async () => {
  let count = 0;

  for (const [word, definition] of Object.entries(data)) {
    try {
      const wordRef = ref(db, `words/${word}`);

      // 🔍 Verifica se já existe
      const snapshot = await get(wordRef);
      if (snapshot.exists()) {
        console.log(`🔹 Palavra "${word}" já existe, pulando...`);
        continue; // Pula para a próxima palavra
      }

      await set(wordRef, definition); // 🔥 Insere a palavra se não existir
      count++;

      if (count % 100 === 0) console.log(`✅ ${count} palavras importadas...`);
    } catch (error) {
      console.error(`❌ Erro ao salvar a palavra "${word}":`, error);
    }
  }

  console.log("🎉 Importação concluída!");
})();
