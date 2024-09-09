import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "@/src/ReusableComponents/Button";

const Layout = () => {
  const isDark = useColorScheme() === "dark";
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="left"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
              <Text
                style={{
                  color: isDark ? "#fff" : "#000",
                  fontSize: 20,
                }}
              >
                {t("back")}
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/community/createpost");
              }}
            >
              <Text style={{ fontSize: 18, color: isDark ? "#fff" : "#000" }}>
                Create
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: t("Community.communityTitle"),
          headerTintColor: isDark ? "#fff" : "000",
          headerStyle: {
            backgroundColor: isDark ? "#333" : "#fff",
          },
        }}
      />
      <Stack.Screen
        name="[postId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createpost"
        options={{
          headerShown: false,
        }}
      />

     
    </Stack>
  );
};

export default Layout;
