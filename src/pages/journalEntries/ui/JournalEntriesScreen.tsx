import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeArea, colors, goBack } from '@/shared';
import { JournalEntriesForm } from '@/features/journalEntries/ui/JournalEntriesForm';

export function JournalEntriesScreen() {
  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      title: "Ro'yhat",
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
    <SafeArea edges={['bottom']} style={s.container}>
      <JournalEntriesForm />
    </SafeArea>
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
