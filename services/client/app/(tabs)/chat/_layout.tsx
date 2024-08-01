import React from "react";
import { router, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                alignItems: "center",
                gap: 10,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <AntDesign name="left" size={24} color="black" />
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>戻る</Text>
            </TouchableOpacity>
          ),
          title: "",
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

      <Stack.Screen
        name="settings"
        options={{
          title: "グループの設定",
          headerBackTitle: "戻る",
        }}
      />

      <Stack.Screen
        name="members"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;
