import { UserProvider } from "@/src/hooks/UserContext";
import { Stack } from "expo-router";

const TabLayout = () => {
  return (
    <UserProvider>
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
            headerTitle: "ChatBot",
            headerBackTitle: "Back",
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
            title: "Profile",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="community"
          options={{
            title: "Profile",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </UserProvider>
  );
};

export default TabLayout;
