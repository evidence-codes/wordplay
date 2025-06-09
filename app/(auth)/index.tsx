import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

// import Text from "@/components/Text";

const book = require("../../assets/images/books.png");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Image source={book} className="w-[200px] h-[200px]" />
        </View>
        <View className="bg-[#3E3BEE] px-10 py-16 rounded-t-[30px]">
          <View>
            <Text className="text-[35px] font-instrument_bold text-white pb-6">
              Welcome to WordPlay!
            </Text>
            <Text className="text-[16px] font-instrument_regular text-white">
              Sharpen your English vocabulary through fun and challenging
              crossword puzzles. Whether you're a beginner or a pro, dive into
              interactive learning with definitions, phonetics, synonyms, and
              more — all while tracking your progress and climbing the
              leaderboard. Let the game begin!
            </Text>
          </View>

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className=" px-10 py-2 rounded-full border border-white mt-8"
              onPress={handleSignIn}
            >
              <Text className="text-[12px] font-bold font-instrument_bold text-white py-4 px-8">
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white px-10 py-2 rounded-full mt-8"
              onPress={handleSignUp}
            >
              <Text className="text-[12px] font-bold font-instrument_bold py-4 px-8">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
