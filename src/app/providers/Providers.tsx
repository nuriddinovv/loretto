import { type ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/entities/session';
import QueryProvider from './QueryProvider';
import { CurrencyProvider } from '@/entities';
import { navigationRef } from '@/shared/lib/NavigationService';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <QueryProvider>
          <AuthProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </AuthProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
