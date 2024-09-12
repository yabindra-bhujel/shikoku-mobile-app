import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => { 
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false,
        }}
      />
        <Stack.Screen
        name="[surveyid]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
