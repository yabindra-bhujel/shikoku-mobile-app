// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../screens/Home/HomeScreen";
// import ChatScreen from "../screens/Chat/ChatScreen";
// import { useColorScheme } from "../hooks/useColorScheme";
// import { Colors } from "../constants/Colors";
// import { FontAwesome5 } from "@expo/vector-icons";
// import CalendarScreen from "../screens/Calendar/CalendarScreen";
// import ChatbotScreen from "../screens/Chatbot/ChatbotScreen";
// import { GroupStack } from "@/app/(tabs)/home/_layout";

// const Tab = createBottomTabNavigator();

// const TabNavigator = () => {
//   const colorScheme = useColorScheme();
//   const themeColors = colorScheme ? Colors[colorScheme] : Colors.light; // Default to light theme if colorScheme is null

//   return (
//       <Tab.Navigator
//         
//       >
//         <Tab.Screen
//           name="home"
//           component={GroupStack}
//           options={{ 
//             tabBarLabel: "Home",
//             headerTintColor: "#D9D9D9",
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name="ChatBot"
//           component={ChatbotScreen}
//           options={{ headerShown: false }}
//         />
//         <Tab.Screen
//           name="Calendar"
//           component={CalendarScreen}
//           options={{ headerShown: false }}
//         />
//         <Tab.Screen
//           name="Chat"
//           component={ChatScreen}
//           options={{ headerShown: false }}
//         />
//       </Tab.Navigator>
//   );
// };

// export default TabNavigator;
