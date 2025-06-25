import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { authService } from "@/utils/authService";
import { progressService } from "@/utils/progressService";
import { User } from "@/types/auth";
import { UserProgress, XP_LIMITS } from "@/types/progress";
import { useRouter } from "expo-router";
import { useUserStore } from "@/components/ui/gluestack-ui-provider";

export default function Profile() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const progress = useUserStore((state) => state.progress);
  const setProgress = useUserStore((state) => state.setProgress);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUser = await authService.getCurrentUser();
    const userProgress = await progressService.getProgress();
    setUser(currentUser);
    setProgress(userProgress);
    setNewName(currentUser?.fullName || "");
  };

  const determineLevel = (progress: UserProgress) => {
    // Check if basic level is completed (reached maximum XP)
    const isBasicCompleted = progress.levelXP.basic >= XP_LIMITS.basic;
    // Check if moderate level is completed (reached maximum XP)
    const isModerateCompleted = progress.levelXP.moderate >= XP_LIMITS.moderate;
    // Check if advanced level is completed (reached maximum XP)
    const isAdvancedCompleted = progress.levelXP.advanced >= XP_LIMITS.advanced;

    if (isAdvancedCompleted) {
      return "Advanced Level";
    } else if (isModerateCompleted) {
      return "Moderate Level";
    } else if (isBasicCompleted) {
      return "Basic Level";
    } else {
      return "Basic Level";
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      fullName: newName,
    };
    await authService.updateUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets[0].uri) {
        const updatedUser = {
          ...user!,
          profileImage: result.assets[0].uri,
        };
        await authService.updateUser(updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#3E3BEE] px-10 py-12 flex-col items-center justify-center">
        <Text className="font-instrument_bold text-[30px] text-white mb-2">
          Profile
        </Text>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require("../../assets/images/default-image.png")
            }
            className="w-[100px] h-[100px] rounded-full border-2 border-white self-center"
          />
        </TouchableOpacity>
      </View>

      <View>
        <View>
          <Text className="text-[14px] font-instrument_bold text-center py-8">
            Personal Info
          </Text>
        </View>

        <View>
          <View className="flex-row items-center gap-4 px-6 py-4">
            <Image
              source={require("../../assets/images/user-square.png")}
              className="w-[24px] h-[24px]"
            />
            <View>
              <Text className="font-instrument_regular text-[14px]">
                Full name
              </Text>
              {isEditing ? (
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  className="font-instrument_semibold text-[16px] border-b border-gray-300 py-1"
                  autoFocus
                />
              ) : (
                <Text className="font-instrument_semibold text-[16px]">
                  {user?.fullName}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-4 px-6 py-4">
            <Image
              source={require("../../assets/images/sms-tracking.png")}
              className="w-[24px] h-[24px]"
            />
            <View>
              <Text className="font-instrument_regular text-[14px]">
                Email Address
              </Text>
              <Text className="font-instrument_semibold text-[14px]">
                {user?.email}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 px-6 py-4">
            <Image
              source={require("../../assets/images/crown.png")}
              className="w-[24px] h-[24px]"
            />
            <View>
              <Text className="font-instrument_regular text-[14px]">Level</Text>
              <Text className="font-instrument_semibold text-[16px]">
                {progress ? determineLevel(progress) : "Basic Level"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 px-6 py-4">
            <Image
              source={require("../../assets/images/cup.png")}
              className="w-[24px] h-[24px]"
            />
            <View>
              <Text className="font-instrument_regular text-[14px]">XP</Text>
              <Text className="font-instrument_semibold text-[16px]">
                {progress?.totalXP || 0} XP
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-8 space-y-8">
          <TouchableOpacity
            className="border border-black rounded-full py-4 px-6 mb-2 w-full items-center"
            onPress={isEditing ? handleSaveProfile : handleEditProfile}
          >
            <Text className="font-instrument_bold text-[16px] text-black">
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 rounded-full py-4 px-6 w-full items-center"
            onPress={handleLogout}
          >
            <Text className="font-instrument_bold text-[16px] text-white">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
