import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeArea, colors, goBack } from '@/shared';
import { CashReportForm } from '@/features';
import { ProtectedScreen } from '@/shared/ui';

export function CashReportScreen() {
  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Kassa otchet',
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
    <ProtectedScreen requiredPermission="cashReport">
      <SafeArea edges={['bottom']} style={s.container}>
        <CashReportForm />
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
