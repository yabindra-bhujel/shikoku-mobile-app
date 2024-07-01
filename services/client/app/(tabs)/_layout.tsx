import { Stack } from "expo-router";
import React from "react";

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
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          headerTitle: "Calendar",
          headerBackTitle: "Back",
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
    </Stack>
  );
};

export default TabLayout;
