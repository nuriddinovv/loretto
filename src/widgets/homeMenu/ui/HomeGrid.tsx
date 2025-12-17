import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { modules } from '../model/modules';
import { useAuth } from '@/entities/session';
import { navigate } from '@/shared/lib/NavigationService';
import { colors } from '@/shared/theme';

export function HomeMenuGrid() {
  const { can } = useAuth();

  const visibleModules = useMemo(
    () => modules.filter(m => !m.permissionKey || can(m.permissionKey)),
    [can],
  );

  return (
    <View style={s.grid}>
      {visibleModules.map(m => (
        <TouchableOpacity
          key={m.route}
          activeOpacity={0.7}
          style={s.box}
          onPress={() => navigate(m.route)}
        >
          <Image source={m.image} style={s.icon} resizeMode="center" />
          <Text style={s.text}>{m.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  box: {
    width: '47%',
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    borderColor: colors.border,
    borderWidth: 1,
  },
  icon: { width: 80, height: 80, marginTop: 10 },
  text: { textAlign: 'center', fontSize: 16, fontWeight: 700 },
});
