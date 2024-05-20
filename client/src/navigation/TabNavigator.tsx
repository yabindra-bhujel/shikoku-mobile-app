import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme ? Colors[colorScheme] : Colors.light; // Default to light theme if colorScheme is null

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chat') {
            iconName = 'comments';
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: themeColors.background },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
