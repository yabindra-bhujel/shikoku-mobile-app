import { Stack } from "expo-router";

const StackLayout = () => {
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
    </Stack>
  );
};

export default StackLayout;
