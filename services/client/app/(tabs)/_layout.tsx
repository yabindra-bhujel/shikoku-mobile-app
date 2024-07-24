import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import { useState } from "react";
import React from "react";

const TabLayout = () => {
  const isDark = useColorScheme() === "dark";

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
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          headerTitle: "Calendar",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: isDark ? "#333" : "white",
          },
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: "Chat",
          headerBackTitle: "Back",
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
      {/* <Stack.Screen
        name="createpost"
        options={{
          headerShown: false,
        }} */}
      {/* /> */}

      <Stack.Screen
        name="reminder"
        options={{
          headerShown: false,
        }}
        />

    </Stack>
  );
};

export default TabLayout;
