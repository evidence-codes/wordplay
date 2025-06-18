import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { vocabularyService } from "@/utils/vocabularyService";

type WordEntry = {
  word: string;
  foundAt: string;
};

export default function Vocabulary() {
  const router = useRouter();

  const [words, setWords] = useState<{
    basic: WordEntry[];
    moderate: WordEntry[];
    advanced: WordEntry[];
  }>({
    basic: [],
    moderate: [],
    advanced: [],
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadWords();
    loadFavorites();
  }, []);

  const loadWords = async () => {
    const allWords = await vocabularyService.getAllWords();
    setWords(allWords);
  };

  const loadFavorites = async () => {
    const favoriteWords = await vocabularyService.getFavorites();
    setFavorites(favoriteWords);
  };

  const handleWordPress = (word: string) => {
    router.push(`/vocabulary/${word}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#3E3BEE]">
        <Text className="text-[30px] font-instrument_bold text-white px-10 py-12">
          My Vocabulary
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <View className="mt-4">
            <Text className="text-[20px] font-instrument_bold text-[#FFBB32] mb-2">
              Favorites ({favorites.length})
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {favorites.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleWordPress(word)}
                  className="bg-[#FFE4B8] rounded-full px-4 py-2"
                >
                  <Text className="font-instrument_regular">{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Basic Words */}
        <View className="mt-4">
          <Text className="text-[20px] font-instrument_bold text-[#3E3BEE] mb-2">
            Basic Words ({words.basic.length})
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {words.basic.map((entry, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleWordPress(entry.word)}
                className="bg-[#FFF1B8] rounded-full px-4 py-2"
              >
                <Text className="font-instrument_regular">{entry.word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moderate Words */}
        <View className="mt-6">
          <Text className="text-[20px] font-instrument_bold text-[#3E3BEE] mb-2">
            Moderate Words ({words.moderate.length})
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {words.moderate.map((entry, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleWordPress(entry.word)}
                className="bg-[#FFF1B8] rounded-full px-4 py-2"
              >
                <Text className="font-instrument_regular">{entry.word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advanced Words */}
        <View className="mt-6 mb-4">
          <Text className="text-[20px] font-instrument_bold text-[#3E3BEE] mb-2">
            Advanced Words ({words.advanced.length})
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {words.advanced.map((entry, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleWordPress(entry.word)}
                className="bg-[#FFF1B8] rounded-full px-4 py-2"
              >
                <Text className="font-instrument_regular">{entry.word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
