import { Stack } from "expo-router";

const StackLayout =() => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerTitle: "Chatbot",
                headerShown: false
            }}/>

        </Stack>
    )
}

export default StackLayout;