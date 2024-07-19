import React from "react";
import { router, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "チャットリスト",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <AntDesign
              name="left"
              size={22}
              color="black"
              onPress={() => router.back()}
            />
          ),
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="[groupId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="settings" options={{
        title: "グループの設定",
        headerBackTitle: "戻る"
      }} />

      <Stack.Screen name="members" options={{
        title: "メンバーリスト",
        headerBackTitle: "戻る"
      }} />

    </Stack>
  );
};

export default StackLayout;
