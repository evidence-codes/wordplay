import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
    "InstrumentSans-BoldItalic": require("../assets/fonts/InstrumentSans-BoldItalic.ttf"),
    "InstrumentSans-Medium": require("../assets/fonts/InstrumentSans-Medium.ttf"),
    "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
    "InstrumentSans-SemiBoldItalic": require("../assets/fonts/InstrumentSans-SemiBoldItalic.ttf"),
    "InstrumentSans-SemiBold": require("../assets/fonts/InstrumentSans-SemiBold.ttf"),
    "InstrumentSans-MediumItalic": require("../assets/fonts/InstrumentSans-MediumItalic.ttf"),
    "InstrumentSans-Italic": require("../assets/fonts/InstrumentSans-Italic.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <RootLayoutNav />
    </GluestackUIProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("loggedIn");
        setInitialRoute(isLoggedIn === "true" ? "(tabs)" : "(auth)");
      } catch (error) {
        console.error("Error checking login status:", error);
        setInitialRoute("(auth)"); // Default to auth if there's an error
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(game-screens)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
