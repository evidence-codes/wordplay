import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Puzzle() {
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#3E3BEE]">
        <Text className="text-[30px] font-instrument_bold text-white px-10 py-12">
          Choose Your Challenge
        </Text>
      </View>

      <View>
        <View className="flex-row items-center justify-between px-8 py-4 gap-4">
          <View className="flex-shrink-0">
            <Image
              source={require("../../assets/images/game-3.png")}
              className="w-[200px] h-[150px]"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-[700] text-[#333333] font-instrument_semibold">
              Basic Vocabulary
            </Text>
            <Text className="text-[10px] font-instrument_regular text-[#666666] flex-wrap py-4">
              Start here if you're new to English or want a light challenge.
              These puzzles include everyday words, simple spellings, and
              commonly used terms to build foundational vocabulary.
            </Text>
            <TouchableOpacity>
              <View className="w-[120px] rounded-[5px] bg-[#3E3BEE]">
                <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                  Start Puzzle
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-8 py-4 gap-4">
          <View className="flex-shrink-0">
            <Image
              source={require("../../assets/images/game-2.png")}
              className="w-[200px] h-[150px]"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-[700] text-[#333333] font-instrument_semibold">
              Moderate Level
            </Text>
            <Text className="text-[10px] font-instrument_regular text-[#666666] flex-wrap py-4">
              Ready to level up? These puzzles include moderately challenging
              words, synonyms, and antonyms that help expand your vocabulary and
              understanding of word relationships.
            </Text>
            <TouchableOpacity>
              <View className="w-[120px] rounded-[5px] bg-[#3E3BEE]">
                <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                  Start Puzzle
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-8 py-4 gap-4">
          <View className="flex-shrink-0">
            <Image
              source={require("../../assets/images/game-1.png")}
              className="w-[200px] h-[150px]"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-[700] text-[#333333] font-instrument_semibold">
              Advanced Words
            </Text>
            <Text className="text-[10px] font-instrument_regular text-[#666666] flex-wrap py-4">
              Designed for advanced learners and word enthusiasts. Expect rare,
              academic, or complex vocabulary, with a focus on precision,
              phonetics, and contextual understanding.
            </Text>
            <TouchableOpacity>
              <View className="w-[120px] rounded-[5px] bg-[#3E3BEE]">
                <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                  Start Puzzle
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
