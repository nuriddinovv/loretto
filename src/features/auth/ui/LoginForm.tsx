import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Keyboard,
  Image,
} from 'react-native';
import { images } from '../../../shared/assets';
import { Button } from '@/shared/ui';
import { colors } from '@/shared/theme';

type Props = {
  onSubmit?: (payload: {
    UserName: string;
    Password: string;
    CompanyDB: string;
  }) => void;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = useMemo(() => {
    return login.trim().length > 0 && password.length > 0 && !isLoading;
  }, [login, password, isLoading]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      UserName: login.trim(),
      Password: password,
      CompanyDB: 'LORETTO',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.flex}
        onPress={Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={images.fullLogo}
            style={styles.logo}
            resizeMode="contain"
          />

          <View>
            <View style={styles.field}>
              <Text style={styles.label}>Login</Text>
              <TextInput
                value={login}
                onChangeText={setLogin}
                placeholder="Login"
                autoCapitalize="none"
                placeholderTextColor={'black'}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Parol</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Parol"
                secureTextEntry
                placeholderTextColor={'black'}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={styles.input}
              />
            </View>
          </View>

          <Button
            title="Kirish"
            isFullWidth
            onPress={handleSubmit}
            isDisabled={!canSubmit}
            loading={!!isLoading}
          />

          <Image
            source={images.fullLogo}
            style={styles.saplogo}
            resizeMode="contain"
          />
        </ScrollView>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
  },
  logo: {
    height: 100,
    alignSelf: 'center',
    marginTop: 12,
  },
  saplogo: {
    height: 60,
    display: 'none',
    alignSelf: 'center',
    marginTop: 12,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.textSecondary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.border,
    paddingHorizontal: 12,
    color: 'black',
  },
  error: { marginTop: 6, marginBottom: 10 },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
