import { Stack } from "expo-router";
import { useRouter } from "expo-router";

export default function GameLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="basic" options={{ headerShown: false }} />
    </Stack>
  );
}
