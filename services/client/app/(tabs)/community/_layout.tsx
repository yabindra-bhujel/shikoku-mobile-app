import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
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

      <Stack.Screen
        name="notification"
        options={{
          headerShown: false,
        }}

        />
        
    </Stack>
  );
};

export default Layout;
