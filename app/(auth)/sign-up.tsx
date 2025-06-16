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
import { useState } from "react";
import { authService } from "@/utils/authService";

function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = () => {
    router.push("/");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!fullName) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const success = await authService.signup({
      fullName,
      email,
      password,
    });

    if (success) {
      router.push("/sign-in");
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "Email already exists",
      }));
    }
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
                value={fullName}
                onChangeText={setFullName}
                className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                keyboardType="name-phone-pad"
              />
              {errors.fullName ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.fullName}
                </Text>
              ) : null}
            </View>
            <View className="mb-4">
              <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                keyboardType="email-address"
              />
              {errors.email ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>
            <View className="mb-4">
              <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                keyboardType="default"
                textContentType="password"
                secureTextEntry={true}
              />
              {errors.password ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>
            <View className="mb-4">
              <Text className="text-[14px] font-instrument_semibold text-[#333333] py-[4px]">
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="h-[50px] bg-[#F5F5F5] rounded-[10px] px-4"
                keyboardType="default"
                textContentType="password"
                secureTextEntry={true}
              />
              {errors.confirmPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </Text>
              ) : null}
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
                onPress={handleSignUp}
                className="bg-[#3E3BEE] px-10 py-2 rounded-full mt-8 h-[70px] flex items-center justify-center"
              >
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

export default SignUp;
