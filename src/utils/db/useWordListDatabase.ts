import { useSQLiteContext } from "expo-sqlite";

export type WordListDatabase = {
  id: number;
  word: string;
};

export function useWordListDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<WordListDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO words (word) VALUES ($word)"
    );
    try {
      const result = await statement.executeAsync({
        $word: data.word,
      });
    } catch (error) {
      throw error;
    }
  }
  return { create };
}
