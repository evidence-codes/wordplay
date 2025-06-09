import { SafeAreaView, View, Text, Image } from "react-native";

export default function Home() {
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#3E3BEE] px-10">
        <View className="pt-16 flex-row items-center justify-between">
          <View>
            <Text className="text-[36px] font-instrument_bold text-white">
              Hi, James
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
            Good Afternoon
          </Text>
        </View>

        <View className="flex-1 bg-white border-b-[1px] border-b-white mt-4 mb-4"></View>

        <View className="flex-row justify-around mb-4">
          <View>
            <Text className="text-[16px] text-white font-instrument_regular">
              Score
            </Text>
            <Text className="text-[30px] text-white font-instrument_bold">
              334 XP
            </Text>
          </View>
          <View>
            <Text className="text-[16px] text-white font-instrument_regular">
              Streak
            </Text>
            <Text className="text-[30px] text-white font-instrument_bold">
              27 Days
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-white border-b-[1px] border-b-white mt-2 mb-2"></View>
      </View>
    </SafeAreaView>
  );
}
