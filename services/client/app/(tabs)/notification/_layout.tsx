import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const RootLayout = () => {
  const theme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notification",
          headerShown: false,
          headerStyle: {
            backgroundColor: theme === "dark" ? "red" : "#000",
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
