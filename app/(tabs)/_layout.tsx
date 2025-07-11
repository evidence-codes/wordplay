import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "react-native";
import { Platform } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar backgroundColor="#3E3BEE" barStyle="dark-content" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3E3BEE",
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: {
            height: Platform.OS === "android" ? 70 : 85, // Increased height for iOS
            paddingBottom: Platform.OS === "android" ? 10 : 25, // Added bottom padding for iOS
            paddingTop: Platform.OS === "android" ? 5 : 10, // Added top padding for iOS
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#eee",
          },
          tabBarLabelStyle: {
            fontFamily: "InstrumentSans-Regular",
            fontSize: 12,
            paddingBottom: Platform.OS === "android" ? 5 : 8, // Increased padding for iOS
          },
          tabBarIconStyle:
            Platform.OS === "ios"
              ? {
                  marginTop: 5,
                }
              : undefined,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="puzzle"
          options={{
            title: "Puzzle",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="extension-puzzle" color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="vocabulary"
          options={{
            title: "Vocabulary",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="person-circle" color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
