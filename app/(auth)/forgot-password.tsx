import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (text && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };
  return (
    <SafeAreaView className="flex-1 bg-[#3E3BEE]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View className="px-10 pt-16 pb-8">
            <Text className="text-[35px] font-instrument_bold text-white">
              Forgot Password
            </Text>
            <Text className="text-[14px] text-white py-2">
              No worries — enter your email and we’ll send you a link to reset
              it.
            </Text>
          </View>

          {otpSent ? (
            <View className="bg-white pt-20">
              <Image
                source={require("../../assets/images/mailbox.png")}
                className="self-center w-[200px] h-[200px]"
              />

              <View className="px-10 py-8 flex">
                <View className="mb-4">
                  <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                    Input the code sent to your mail
                  </Text>
                  <View className="flex-row justify-between pr-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) {
                            inputs.current[index] = ref;
                          }
                        }}
                        value={otp[index]}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        className="w-[50px] h-[50px] bg-[#F5F5F5] rounded-[10px] text-[20px] text-center"
                        keyboardType="numeric"
                        maxLength={1}
                        style={{ marginRight: index !== 5 ? 4 : 0 }}
                      />
                    ))}
                  </View>

                  <View className="mt-8">
                    <TouchableOpacity
                      className="bg-[#3E3BEE] px-10 py-2 rounded-full mt-8 h-[70px] flex items-center justify-center"
                      onPress={() => {}}
                    >
                      <Text className="text-[14px] text-white text-center font-bold font-instrument_bold">
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex flex-row items-center justify-center mt-[120px] mb-20">
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
              </View>
            </View>
          ) : (
            <View className="bg-white pt-20">
              <Image
                source={require("../../assets/images/avatar-2.png")}
                className="self-center w-[200px] h-[200px]"
              />

              <View className="px-10 py-8 flex">
                <View className="mb-4">
                  <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                    Input Email
                  </Text>
                  <TextInput
                    className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                    keyboardType="email-address"
                  />

                  <View className="mt-8">
                    <TouchableOpacity
                      className="bg-[#3E3BEE] px-10 py-2 rounded-full mt-8 h-[70px] flex items-center justify-center"
                      onPress={() => setOtpSent(true)}
                    >
                      <Text className="text-[14px] text-white text-center font-bold font-instrument_bold">
                        Send OTP
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex flex-row items-center justify-center mt-[120px] mb-20">
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
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
