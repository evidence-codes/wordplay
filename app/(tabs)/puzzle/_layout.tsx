import { Stack } from "expo-router";

export default function PuzzleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="basic" />
      <Stack.Screen name="moderate" />
      <Stack.Screen name="advanced" />
    </Stack>
  );
}
