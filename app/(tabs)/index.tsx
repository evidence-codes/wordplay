import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { authService } from "@/utils/authService";
import { progressService } from "@/utils/progressService";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    const loadUserData = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserName(user.fullName.split(" ")[0]); // Get first name
        setUserImage(user.profileImage || null); // Set profile image if exists
      }
      setGreeting(getGreeting());

      const progress = await progressService.getProgress();
      if (progress) {
        setXP(progress.totalXP);
        setStreak(progress.streak);
      }
    };

    loadUserData();

    // Update greeting every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePlayPuzzle = () => {
    router.push("/(tabs)/puzzle");
  };

  const handleVocabulary = () => {
    router.push("/(tabs)/vocabulary");
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#3E3BEE] px-8">
        <View className="pt-16 flex-row items-center justify-between">
          <View>
            <Text className="text-[30px] font-instrument_bold text-white">
              Hi, {userName || "Guest"}
            </Text>
          </View>
          <View>
            <Image
              source={
                userImage
                  ? { uri: userImage }
                  : require("../../assets/images/default-image.png")
              }
              className="w-[50px] h-[50px] rounded-full border-2 border-white self-center"
            />
          </View>
        </View>
        <View>
          <Text className="text-[16px] font-instrument_regular text-white">
            {greeting}
          </Text>
        </View>

        <View className="flex-1 bg-white border-b-[1px] border-b-white mt-4 mb-4"></View>

        <View className="flex-row justify-around mb-4">
          <View>
            <Text className="text-[16px] text-white font-instrument_regular">
              Score
            </Text>
            <Text className="text-[30px] text-white font-instrument_bold">
              {xp} XP
            </Text>
          </View>
          <View>
            <Text className="text-[16px] text-white font-instrument_regular">
              Streak
            </Text>
            <Text className="text-[30px] text-white font-instrument_bold">
              {streak} Days
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-white border-b-[1px] border-b-white mt-2 mb-2"></View>
      </View>

      {/* Update game cards container and cards */}
      <View className="px-4 pt-6 flex-row justify-around gap-4">
        <View className="border border-[#999999] flex-1 px-4 pb-4 rounded-[10px] bg-white">
          <View>
            <Image
              source={require("../../assets/images/game-2.png")}
              className={`${
                Platform.OS === "android"
                  ? "w-[150px] h-[130px]"
                  : "w-[200px] h-[150px]"
              } self-center mb-2`}
              resizeMode="contain"
            />
            <Text className="text-[16px] font-instrument_bold text-[#333333] mb-1">
              Start a Puzzle
            </Text>
            <Text className="text-[10px] font-instrument_regular text-[#666666] mb-3">
              Choose your level and test your vocabulary with a fun crossword
              challenge
            </Text>

            <TouchableOpacity
              onPress={handlePlayPuzzle}
              className="bg-[#3E3BEE] rounded-[5px]"
            >
              <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                Start Puzzle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border border-[#999999] flex-1 px-4 pb-4 rounded-[10px] bg-white">
          <View>
            <Image
              source={require("../../assets/images/cube.png")}
              className={`${
                Platform.OS === "android"
                  ? "w-[150px] h-[130px]"
                  : "w-[200px] h-[150px]"
              } rounded-[9px] self-center mb-2`}
            />
            <Text className="text-[16px] font-instrument_bold text-[#333333] mb-1">
              Vocabulary
            </Text>
            <Text className="text-[10px] font-instrument_regular text-[#666666] mb-3">
              Review words you've learned — with definitions, phonetics, and
              more
            </Text>

            <TouchableOpacity
              onPress={handleVocabulary}
              className="bg-[#3E3BEE] rounded-[5px]"
            >
              <Text className="text-white text-center text-[12px] font-instrument_semibold py-2">
                View My Words
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
