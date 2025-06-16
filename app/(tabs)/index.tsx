import { SafeAreaView, View, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { authService } from "@/utils/authService";
import { progressService } from "@/utils/progressService";

export default function Home() {
  const [userName, setUserName] = useState("");
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
      if (user?.fullName) {
        setUserName(user.fullName.split(" ")[0]); // Get first name
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

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#3E3BEE] px-10">
        <View className="pt-16 flex-row items-center justify-between">
          <View>
            <Text className="text-[36px] font-instrument_bold text-white">
              Hi, {userName || "Guest"}
            </Text>
          </View>
          <View>
            <Image
              source={require("../../assets/images/default-image.png")}
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
    </SafeAreaView>
  );
}
