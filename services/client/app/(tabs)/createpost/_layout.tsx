import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => { 
  return (
    <Stack>
      <Stack.Screen
        name="create-post"
        options={{ 
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
