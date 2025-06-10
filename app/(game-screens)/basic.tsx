import { SafeAreaView, View, Text } from "react-native";

export default function BasicGameScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#3E3BEE]">
        <Text className="text-[30px] font-instrument_bold text-center text-white px-10 py-12">
          Basic Vocabulary
        </Text>
      </View>
    </SafeAreaView>
  );
}
