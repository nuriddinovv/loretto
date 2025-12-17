import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../pages/Home';
import { LoginScreen } from '../../pages/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export function AppRouter() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={Home}
        options={{ headerShown: true, title: 'Loretto Kassa' }}
      />
    </Stack.Navigator>
  );
}
