import React from "react";
import { router, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";

const StackLayout = () => {
  const isDark = useColorScheme() === "dark";
  const {t} = useTranslation();

  const headerBackgroundColor = isDark ? "#333" : "#fff";
  const headerTextColor = isDark ? "#fff" : "#000";
  const headerTintColor = isDark ? "#f5a623" : "#007AFF";

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
              <AntDesign name="left" size={24} color={headerTextColor} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: headerTextColor,
                }}
              >
                {t("back")}
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: "Group Chat",
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTitleStyle: {
            color: headerTextColor,
          },
        }}
      />

      <Stack.Screen
        name="[groupId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: "グループの設定",
          headerBackTitle: "戻る",
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTitleStyle: {
            color: headerTextColor,
          },
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
