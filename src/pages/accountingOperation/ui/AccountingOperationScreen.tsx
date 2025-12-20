import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeArea, colors, goBack } from '@/shared';
import { AccountingOperationForm } from '@/features';
import { ProtectedScreen } from '@/shared/ui';

export function AccountingOperationScreen() {
  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Buxgalterskiy operatsiya',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goBack}
          style={s.headerButton}
        >
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <ProtectedScreen requiredPermission="journalEntry">
      <SafeArea edges={['bottom']} style={s.container}>
        <AccountingOperationForm />
      </SafeArea>
    </ProtectedScreen>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
});
