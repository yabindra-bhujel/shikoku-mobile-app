import { Stack } from "expo-router";
const TabLayout = () => {
  return (
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
          title: "Chat",
          headerBackTitle: "Back",
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

export default TabLayout;
