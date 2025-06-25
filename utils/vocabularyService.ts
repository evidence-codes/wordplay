import AsyncStorage from "@react-native-async-storage/async-storage";
import wordDetailsData from "../data/wordDetails.json";
import { useVocabularyStore } from "@/components/ui/gluestack-ui-provider";

type WordDetailEntry = {
  phonetics: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
};

type WordDictionary = {
  [key: string]: WordDetailEntry;
};

type WordDatabase = {
  basic: WordDictionary;
  moderate: WordDictionary;
  advanced: WordDictionary;
};

const wordDetails = wordDetailsData as WordDatabase;

type Difficulty = "basic" | "moderate" | "advanced";
type WordEntry = {
  word: string;
  foundAt: string; // ISO date string
};
type WordDetails = {
  word: string;
  phonetics: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  isFavorite: boolean;
};

export const vocabularyService = {
  async storeWord(word: string, difficulty: Difficulty): Promise<void> {
    try {
      const key = `@vocabulary_${difficulty}`;
      const existingWordsStr = await AsyncStorage.getItem(key);
      const existingWords: WordEntry[] = existingWordsStr
        ? JSON.parse(existingWordsStr)
        : [];

      // Check if word already exists
      if (!existingWords.some((entry) => entry.word === word)) {
        const newEntry: WordEntry = {
          word,
          foundAt: new Date().toISOString(),
        };
        existingWords.push(newEntry);
        await AsyncStorage.setItem(key, JSON.stringify(existingWords));
        // Update Zustand store
        const setWords = useVocabularyStore.getState().setWords;
        const allWords = await this.getAllWords();
        setWords(allWords);
        const addWord = useVocabularyStore.getState().addWord;
        addWord(word, difficulty);
      }
    } catch (error) {
      console.error("Error storing word:", error);
    }
  },

  async getWordsByDifficulty(difficulty: Difficulty): Promise<WordEntry[]> {
    try {
      const key = `@vocabulary_${difficulty}`;
      const wordsStr = await AsyncStorage.getItem(key);
      return wordsStr ? JSON.parse(wordsStr) : [];
    } catch (error) {
      console.error("Error getting words:", error);
      return [];
    }
  },

  async getAllWords(): Promise<Record<Difficulty, WordEntry[]>> {
    try {
      const [basic, moderate, advanced] = await Promise.all([
        this.getWordsByDifficulty("basic"),
        this.getWordsByDifficulty("moderate"),
        this.getWordsByDifficulty("advanced"),
      ]);
      // Update Zustand store
      const setWords = useVocabularyStore.getState().setWords;
      setWords({ basic, moderate, advanced });
      return {
        basic,
        moderate,
        advanced,
      };
    } catch (error) {
      console.error("Error getting all words:", error);
      return { basic: [], moderate: [], advanced: [] };
    }
  },

  async getWordDetails(word: string): Promise<WordDetails> {
    try {
      const upperWord = word.toUpperCase();
      let details: WordDetailEntry | undefined;

      // Search through all difficulty levels
      for (const level of ["basic", "moderate", "advanced"] as Difficulty[]) {
        const levelWords = wordDetails[level];
        if (levelWords[upperWord]) {
          details = levelWords[upperWord];
          break;
        }
      }

      if (!details) {
        throw new Error(`Word details not found for: ${word}`);
      }

      return {
        word: upperWord,
        phonetics: details.phonetics,
        partOfSpeech: details.partOfSpeech,
        definition: details.definition,
        example: details.example,
        synonyms: details.synonyms,
        antonyms: details.antonyms,
        isFavorite: await this.isFavorite(upperWord),
      };
    } catch (error) {
      console.error("Error getting word details:", error);
      throw error;
    }
  },

  getDifficultyForWord(word: string): Difficulty | null {
    const upperWord = word.toUpperCase();
    for (const level of ["basic", "moderate", "advanced"] as Difficulty[]) {
      const levelWords = wordDetails[level];
      if (levelWords[upperWord]) {
        return level;
      }
    }
    return null;
  },

  async toggleFavorite(word: string): Promise<void> {
    try {
      const key = "@favorites";
      const favoritesStr = await AsyncStorage.getItem(key);
      const favorites: string[] = favoritesStr ? JSON.parse(favoritesStr) : [];

      const index = favorites.indexOf(word);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(word);
      }

      await AsyncStorage.setItem(key, JSON.stringify(favorites));
      // Update Zustand store
      const setFavorites = useVocabularyStore.getState().setFavorites;
      setFavorites(favorites);
      const toggleFavorite = useVocabularyStore.getState().toggleFavorite;
      toggleFavorite(word);
    } catch (error) {
      throw error;
    }
  },

  async isFavorite(word: string): Promise<boolean> {
    try {
      const key = "@favorites";
      const favoritesStr = await AsyncStorage.getItem(key);
      const favorites: string[] = favoritesStr ? JSON.parse(favoritesStr) : [];
      return favorites.includes(word);
    } catch (error) {
      throw error;
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const key = "@favorites";
      const favoritesStr = await AsyncStorage.getItem(key);
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      // Update Zustand store
      const setFavorites = useVocabularyStore.getState().setFavorites;
      setFavorites(favorites);
      return favorites;
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  },

  async getNextWord(
    currentWord: string,
    difficulty: Difficulty
  ): Promise<string | null> {
    try {
      const allWords = await this.getWordsByDifficulty(difficulty);
      const currentIndex = allWords.findIndex(
        (entry) => entry.word === currentWord
      );

      if (currentIndex === -1 || currentIndex === allWords.length - 1) {
        return null;
      }

      return allWords[currentIndex + 1].word;
    } catch (error) {
      console.error("Error getting next word:", error);
      return null;
    }
  },
};
