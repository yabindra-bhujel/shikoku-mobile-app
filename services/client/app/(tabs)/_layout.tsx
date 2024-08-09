import { UserProvider } from "@/src/hooks/UserContext";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import { useState } from "react";
import React from "react";

const TabLayout = () => {
  const isDark = useColorScheme() === "dark";

  return (
    <UserProvider>
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
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="calendar"
          options={{
            headerTitle: "ChatBot",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Profile",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="community"
          options={{
            headerShown: false,
          }}
        />

      <Stack.Screen
          name="school_event"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setting"
          options={{
            headerShown: false,
          }}
        />
        </Stack>
    </UserProvider>
  );
};

export default TabLayout;
