import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ChartOfAccountsScreen,
  ClientsScreen,
  ExchangeRatesScreen,
  HomeScreen,
  LoginScreen,
} from '@/pages';

const Stack = createNativeStackNavigator();

export function AppRouter() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="exchange-rate" component={ExchangeRatesScreen} />
      <Stack.Screen name="clients" component={ClientsScreen} />
      <Stack.Screen
        name="chart-of-accounts"
        component={ChartOfAccountsScreen}
      />
    </Stack.Navigator>
  );
}
