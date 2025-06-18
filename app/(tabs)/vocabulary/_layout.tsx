import { Stack } from "expo-router";

export default function VocabularyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[word]" />
    </Stack>
  );
}
