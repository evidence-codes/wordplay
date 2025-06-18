import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from "react-native";

export default function Puzzle() {
  const router = useRouter();

  const handleStartBasic = () => {
    router.navigate("/(tabs)/puzzle/basic");
  };

  const handleStartModerate = () => {
    router.navigate("/(tabs)/puzzle/moderate");
  };

  const handleStartAdvanced = () => {
    router.navigate("/(tabs)/puzzle/advanced");
  };
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#3E3BEE]">
        <Text className="text-[30px] font-instrument_bold text-white px-10 py-12">
          Choose Your Challenge
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View
          className={`gap-2 ${Platform.OS === "android" ? "pb-20" : "pb-4"}`}
        >
          {/* Basic Level */}
          <View className="flex-row px-4 py-4 gap-2">
            <View className="flex-shrink-0 justify-center">
              <Image
                source={require("../../../assets/images/game-3.png")}
                className={`${
                  Platform.OS === "android"
                    ? "w-[150px] h-[130px]" // Increased height on Android
                    : "w-[200px] h-[150px]"
                }`}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 px-2">
              <Text className="text-[14px] text-[#333333] font-instrument_semibold">
                Basic Vocabulary
              </Text>
              <Text
                className={`text-[10px] font-instrument_regular text-[#666666] flex-wrap py-2 ${
                  Platform.OS === "android" ? "pr-2" : "py-4"
                }`}
              >
                Start here if you're new to English or want a light challenge.
                These puzzles include everyday words, simple spellings, and
                commonly used terms to build foundational vocabulary.
              </Text>
              <TouchableOpacity onPress={handleStartBasic}>
                <View
                  className={`w-[120px] rounded-[5px] bg-[#3E3BEE] ${
                    Platform.OS === "android" ? "mb-2" : ""
                  }`}
                >
                  <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                    Start Puzzle
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Moderate Level */}
          <View className="flex-row px-4 py-4 gap-2">
            <View className="flex-shrink-0 justify-center">
              <Image
                source={require("../../../assets/images/game-2.png")}
                className={`${
                  Platform.OS === "android"
                    ? "w-[150px] h-[130px]" // Increased height on Android
                    : "w-[200px] h-[150px]"
                }`}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 px-2">
              <Text className="text-[14px] text-[#333333] font-instrument_semibold">
                Moderate Level
              </Text>
              <Text
                className={`text-[10px] font-instrument_regular text-[#666666] flex-wrap py-2 ${
                  Platform.OS === "android" ? "pr-2" : "py-4"
                }`}
              >
                Ready to level up? These puzzles include moderately challenging
                words, synonyms, and antonyms that help expand your vocabulary
                and understanding of word relationships.
              </Text>
              <TouchableOpacity onPress={handleStartModerate}>
                <View
                  className={`w-[120px] rounded-[5px] bg-[#3E3BEE] ${
                    Platform.OS === "android" ? "mb-2" : ""
                  }`}
                >
                  <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                    Start Puzzle
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Advanced Level */}
          <View className="flex-row px-4 py-4 gap-2">
            <View className="flex-shrink-0 justify-center">
              <Image
                source={require("../../../assets/images/game-1.png")}
                className={`${
                  Platform.OS === "android"
                    ? "w-[150px] h-[130px]" // Increased height on Android
                    : "w-[200px] h-[150px]"
                }`}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 px-2">
              <Text className="text-[14px] text-[#333333] font-instrument_semibold">
                Advanced Words
              </Text>
              <Text
                className={`text-[10px] font-instrument_regular text-[#666666] flex-wrap py-2 ${
                  Platform.OS === "android" ? "pr-2" : "py-4"
                }`}
              >
                Designed for advanced learners and word enthusiasts. Expect
                rare, academic, or complex vocabulary, with a focus on
                precision, phonetics, and contextual understanding.
              </Text>
              <TouchableOpacity onPress={handleStartAdvanced}>
                <View
                  className={`w-[120px] rounded-[5px] bg-[#3E3BEE] ${
                    Platform.OS === "android" ? "mb-2" : ""
                  }`}
                >
                  <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                    Start Puzzle
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
