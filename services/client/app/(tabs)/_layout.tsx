import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { Colors } from "@/src/constants/Colors";

import { FontAwesome5 } from "@expo/vector-icons";
import useTheme from "@/src/hooks/CustomTheme";

const TabLayout = () => {

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
          title: "Chat",
          headerBackTitle: "Back",
        }}
      />
       <Stack.Screen name='profile'
      options={{
        title: "Profile",
        headerBackTitle: "Back",
      }}/>
    </Stack>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
