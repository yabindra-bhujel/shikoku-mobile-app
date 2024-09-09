import { UserProvider } from "@/src/hooks/UserContext";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import { useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

const TabLayout = () => {
  const isDark = useColorScheme() === "dark";
  const {t} = useTranslation();

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
            headerTitle: t("calendar.calendarTitle"),
            headerBackTitle: t("back"),
            headerTintColor: isDark ? "#fff" : "000",
            headerStyle: {
              backgroundColor: isDark ? "#333" : "#fff",
            },
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="community"
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

        <Stack.Screen
          name="survey"
          options={{
            headerTitle: "Survey",
            headerBackTitle: t("back"),
            headerTintColor: isDark ? "#fff" : "000",
            headerStyle: {
              backgroundColor: isDark ? "#333" : "#fff",
            },
          }}
        />  
      </Stack>
    </UserProvider>
  );
};

export default TabLayout;
