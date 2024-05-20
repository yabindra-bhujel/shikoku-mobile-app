import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '@/src/screens/LoginScreen';
import ForgetPass from '@/src/screens/ForgetPassScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgetPass" component={ForgetPass} />
        </Stack.Navigator>
    </>
  );
};

export default App;
