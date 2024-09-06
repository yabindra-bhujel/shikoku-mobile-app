import { UserProvider } from "@/src/hooks/UserContext";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { Provider as PaperProvider } from "react-native-paper";

const TabLayout = () => {
  const isDark = useColorScheme() === "dark";
  const { t } = useTranslation();

  return (
    <UserProvider>
      <PaperProvider>
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
        </Stack>
      </PaperProvider>
    </UserProvider> 
  );
};

export default TabLayout;
