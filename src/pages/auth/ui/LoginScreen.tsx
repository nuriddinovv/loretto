import { LoginForm } from '@/features/auth';
import { useLoginMutation } from '@/features/auth/model/useLoginMutation';
import { SafeArea } from '@/shared/ui';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export function LoginScreen() {
  const login = useLoginMutation();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
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
