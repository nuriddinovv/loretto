import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExchangeRatesScreen, HomeScreen, LoginScreen } from '@/pages';

const Stack = createNativeStackNavigator();

export function AppRouter() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="exchange-rate" component={ExchangeRatesScreen} />
    </Stack.Navigator>
  );
}
