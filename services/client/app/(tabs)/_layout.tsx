import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { Colors } from "@/src/constants/Colors";

import { FontAwesome5 } from "@expo/vector-icons";

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme ? Colors[colorScheme] : Colors.light; 

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chatbot"
        options={{
          headerTitle: "ChatBot",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          headerTitle: "ChatBot",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
