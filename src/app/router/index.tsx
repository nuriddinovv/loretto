import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AccountingOperationScreen,
  CashReportScreen,
  ChartOfAccountsScreen,
  ClientsScreen,
  ExchangeRatesScreen,
  ExchangeScreen,
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
      <Stack.Screen name="currency-exchange" component={ExchangeScreen} />
      <Stack.Screen
        name="accounting-operation"
        component={AccountingOperationScreen}
      />
      <Stack.Screen name="cash-report" component={CashReportScreen} />
      <Stack.Screen name="clients" component={ClientsScreen} />
      <Stack.Screen
        name="chart-of-accounts"
        component={ChartOfAccountsScreen}
      />
    </Stack.Navigator>
  );
}
