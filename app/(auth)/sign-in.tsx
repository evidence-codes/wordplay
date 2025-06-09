import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      // Save token or login flag
      await AsyncStorage.setItem("loggedIn", "true");
      router.push("/(tabs)");
    } catch (error) {
      console.log("Failed to save login status", error);
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };
  return (
    <SafeAreaView className="flex-1 bg-[#3E3BEE]">
      <View className="px-10 pt-16 pb-8">
        <Text className="text-[35px] font-instrument_bold text-white">
          Sign In
        </Text>
        <Text className="text-[14px] text-white py-2">
          Welcome back! Log in to continue building your vocabulary through fun
          and challenging puzzles
        </Text>
      </View>

      <View className="bg-white pt-10 pb-[100px]">
        <View className="self-center">
          <Image
            source={require("../../assets/images/avatar-1.png")}
            className="w-[200px] h-[200px]"
          />
        </View>

        <View className="px-10 py-8">
          <View className="mb-4">
            <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
              Email
            </Text>
            <TextInput
              className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
              keyboardType="email-address"
            />
          </View>
          <View className="mb-4">
            <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
              Password
            </Text>
            <TextInput
              className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
              keyboardType="default"
              textContentType="password"
              secureTextEntry={true}
            />
          </View>
          <View className="self-end">
            <Text
              className="text-[14px] font-instrument_semibold text-[#333333]"
              onPress={handleForgotPassword}
            >
              Forgot Password
            </Text>
          </View>

          <View className="mt-8">
            <TouchableOpacity
              className="bg-[#3E3BEE] px-10 py-2 rounded-full mt-8 h-[70px] flex items-center justify-center"
              onPress={handleSignIn}
            >
              <Text className="text-[14px] text-white text-center font-bold font-instrument_bold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center justify-center mt-8">
            <Text className="text-[14px] font-instrument_semibold text-[#333333]">
              Don't have an account?{" "}
            </Text>
            <Text
              className="text-[14px] font-instrument_semibold text-[#3E3BEE]"
              onPress={handleSignUp}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
