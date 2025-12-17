import { LoginForm } from '@/features/auth/login';
import { useLoginMutation } from '@/features/auth/login/model/useLoginMutation';
import { SafeArea } from '@/shared/ui';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export function LoginScreen() {
  const login = useLoginMutation();
  return (
    <SafeArea edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <LoginForm
          onSubmit={payload => login.mutate(payload)}
          isLoading={login.isPending}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
