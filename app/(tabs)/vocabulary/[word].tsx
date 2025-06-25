import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { vocabularyService } from "@/utils/vocabularyService";
import { useVocabularyStore } from "@/components/ui/gluestack-ui-provider";

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

type Difficulty = "basic" | "moderate" | "advanced";

export default function WordDetailsScreen() {
  const { word } = useLocalSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState<WordDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const toggleFavoriteStore = useVocabularyStore(
    (state) => state.toggleFavorite
  );

  useEffect(() => {
    loadWordDetails();
  }, [word]);

  const loadWordDetails = async () => {
    try {
      const data = await vocabularyService.getWordDetails(word as string);
      setDetails(data);
      const diff = vocabularyService.getDifficultyForWord(word as string);
      setDifficulty(diff);
    } catch (error) {
      console.error("Error loading word details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!details) return;
    try {
      await vocabularyService.toggleFavorite(details.word);
      toggleFavoriteStore(details.word);
      setDetails((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const goToNextWord = async () => {
    if (!details || !difficulty) return;

    const nextWord = await vocabularyService.getNextWord(
      details.word,
      difficulty
    );
    if (nextWord) {
      router.push(`/vocabulary/${nextWord}`);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3E3BEE" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="bg-[#3E3BEE] px-10 py-12 mb-6">
          <Text className="text-[35px] font-instrument_bold text-white mb-2">
            {details?.word}
          </Text>
          <Text className="text-[16px] font-instrument_regular text-white/80">
            {details?.phonetics}
          </Text>
        </View>

        {/* Content Section */}
        <View className="px-6 pb-6">
          {/* Part of Speech */}
          <View className="mb-8">
            <Text className="text-[14px] font-instrument_regular text-[#666666] mb-2">
              Part of Speech
            </Text>
            <Text className="text-[18px] font-instrument_bold text-[#333333]">
              {details?.partOfSpeech}
            </Text>
          </View>

          {/* Definition */}
          <View className="mb-8">
            <Text className="text-[14px] font-instrument_regular text-[#666666] mb-2">
              Definition
            </Text>
            <Text className="text-[18px] font-instrument_regular text-[#333333] leading-7">
              {details?.definition}
            </Text>
          </View>

          {/* Example */}
          <View className="mb-8">
            <Text className="text-[14px] font-instrument_regular text-[#666666] mb-2">
              Example
            </Text>
            <Text className="text-[18px] font-instrument_italic text-[#333333] leading-7">
              "{details?.example}"
            </Text>
          </View>

          {/* Synonyms */}
          <View className="mb-8">
            <Text className="text-[14px] font-instrument_regular text-[#666666] mb-4">
              Synonyms
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {details?.synonyms.map((synonym, index) => (
                <View
                  key={index}
                  className="bg-[#FFF1B8] rounded-full px-4 py-2 mb-2"
                >
                  <Text className="font-instrument_regular">{synonym}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Antonyms */}
          <View className="mb-8">
            <Text className="text-[14px] font-instrument_regular text-[#666666] mb-4">
              Antonyms
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {details?.antonyms.map((antonym, index) => (
                <View
                  key={index}
                  className="bg-[#FFF1B8] rounded-full px-4 py-2 mb-2"
                >
                  <Text className="font-instrument_regular">{antonym}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={toggleFavorite}
          className="flex-row items-center space-x-2 bg-[#3E3BEE] px-6 py-3 rounded-full"
        >
          <Ionicons
            name={details?.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="white"
          />
          <Text className="text-white font-instrument_bold ml-2">
            {details?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextWord}
          className="bg-[#FFBB32] px-6 py-3 rounded-full"
        >
          <Text className="text-white font-instrument_bold">Next Word</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
