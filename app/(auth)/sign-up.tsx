import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SignUp() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/");
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
          Create Account
        </Text>
        <Text className="text-[14px] text-white py-2">
          Create your account and start your journey to mastering English — one
          word at a time!
        </Text>
      </View>

      <View className="bg-white pt-10 pb-[200px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="self-center">
            <Image
              source={require("../../assets/images/avatar-1.png")}
              className="w-[200px] h-[200px]"
            />
          </View>

          <View className="px-10 py-8">
            <View className="mb-4">
              <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                Full Name
              </Text>
              <TextInput
                className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                keyboardType="name-phone-pad"
              />
            </View>
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
            <View className="mb-4">
              <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                Confirm Password
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
              <TouchableOpacity className="bg-[#3E3BEE] px-10 py-2 rounded-full mt-8 h-[70px] flex items-center justify-center">
                <Text className="text-[14px] text-white text-center font-bold font-instrument_bold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center justify-center mt-8">
              <Text className="text-[14px] font-instrument_semibold text-[#333333]">
                Already have an account?{" "}
              </Text>
              <Text
                className="text-[14px] font-instrument_semibold text-[#3E3BEE]"
                onPress={handleSignIn}
              >
                Login
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
