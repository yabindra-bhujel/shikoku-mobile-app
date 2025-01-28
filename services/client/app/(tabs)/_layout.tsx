import { UserProvider } from "@/src/hooks/UserContext";
import { NotificationProvider } from "@/src/hooks/notificationProvider";
import { Stack } from "expo-router";
import { View, useColorScheme, TouchableOpacity  } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabLayout = () => {
  const isDark = useColorScheme() === "dark";
  const {t} = useTranslation();

  return (
    <UserProvider>
      <NotificationProvider>
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
          name="notification"
          options={{
            headerTitle: "Notification",
            headerBackTitle: t("back"),
            headerTintColor: isDark ? "#fff" : "000",
            headerStyle: {
              backgroundColor: isDark ? "#333" : "#fff",
            },
          }}
        />
      </Stack>
      </NotificationProvider>
    </UserProvider>
  );
};

export default TabLayout;
