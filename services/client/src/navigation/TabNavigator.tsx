import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/HomeScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import CalendarScreen from "../screens/Calendar/CalendarScreen";
import ChatbotScreen from "../screens/Chatbot/ChatbotScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme ? Colors[colorScheme] : Colors.light; // Default to light theme if colorScheme is null

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Chat") {
              iconName = "comments";
            } else if (route.name === "ChatBot") {
              iconName = "robot";
            } else if (route.name === "Calendar") {
              iconName = "calendar";
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: themeColors.background },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            tabBarLabel: "Home",
            headerTintColor: "#D9D9D9",
      
          }}
        />
        <Tab.Screen
          name="ChatBot"
          component={ChatbotScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
  );
};

export default TabNavigator;
