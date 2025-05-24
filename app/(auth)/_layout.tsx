import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
// import { Icon, ChevronLeftIcon } from "@/components/ui/icon";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
