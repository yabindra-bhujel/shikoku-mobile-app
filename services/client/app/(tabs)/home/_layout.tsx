import useTheme from "@/src/hooks/CustomTheme";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => { 
   const { theme } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home" ,
          headerShown: false,
          headerStyle: {
            backgroundColor: theme === "dark" ? "#f3f3f3" : "#000", 
          }
          
        }}
      />
      {/* <Stack.Screen name="[noticeId]"/> */}
    </Stack>
  );
};

export default RootLayout;
