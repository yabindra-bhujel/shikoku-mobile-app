import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "@/src/hooks/themeContext";
import { Colors } from "@/src/constants/Colors";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const RootLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener(
      "themeChange",
      (data: boolean) => {
        setDarkMode(!!data); // Ensure data is treated as a boolean
        console.log(data);
      }
    );

    const listenerString: string | null =
      typeof listener === "string" ? listener : null;

    return () => {
      if (listenerString) {
        EventRegister.removeEventListener(listenerString);
      }
    };
  }, [darkMode]);

  return (
    <themeContext.Provider value={darkMode === true ? Colors.dark : Colors.light}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </themeContext.Provider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },
});
