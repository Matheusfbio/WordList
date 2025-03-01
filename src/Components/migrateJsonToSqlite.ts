import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as SQLite from "expo-sqlite";

// Função para abrir/criar banco de dados SQLite
const db = SQLite.openDatabaseAsync("words.db");

const MigrateJsonToSqlite = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // URL do JSON
        const jsonUrl =
          "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json";

        // Baixar o JSON
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();

        // Criar tabela SQLite usando transações assíncronas
        await (await db).execAsync([{ sql: "BEGIN TRANSACTION;" }]);
        await (
          await db
        ).execAsync(
          [
            {
              sql: "CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);",
              [],
            },
          ],
          false
        );

        // Inserir dados no SQLite
        for (const word of Object.keys(jsonData)) {
          await (
            await db
          ).execAsync(
            [
              {
                sql: "INSERT INTO words (word) VALUES (?);",
                args: [word],
              },
            ],
            false
          );
        }

        // Finalizar transação
        await (await db).execAsync([{ sql: "COMMIT;", args: [] }], false);
        console.log("Banco de dados configurado com sucesso!");
      } catch (error) {
        console.error("Erro ao configurar o banco de dados:", error);
        await (await db).execAsync([{ sql: "ROLLBACK;", args: [] }], false); // Reverter transação em caso de erro
      }
    };

    setupDatabase();
  }, []);

  return (
    <View styles={styles.container}>
      <Text styles={styles.text}>
        Configuração do banco de dados em onprogress...
      </Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default MigrateJsonToSqlite;
