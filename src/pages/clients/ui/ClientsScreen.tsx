// src/pages/clients/ui/ClientsScreen.tsx
import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/shared/theme';
import { debouncedValue, goBack, SafeArea } from '@/shared';
import { useClientsQuery } from '@/entities';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { ProtectedScreen } from '@/shared/ui';

export function ClientsScreen() {
  const nav = useNavigation();
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Mijozlar',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goBack}
          style={{ paddingHorizontal: 10 }}
        >
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
      ),
    });
  });

  const [q, setQ] = useState('');
  const dq = debouncedValue(q, 400);

  const clients = useClientsQuery(dq);

  const data = useMemo(() => clients.data ?? [], [clients.data]);

  return (
    <ProtectedScreen requiredPermission="clients">
      <SafeArea edges={['bottom']} style={s.container}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Mijoz qidirish..."
          style={s.search}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />

        {clients.isFetching && (
          <View style={s.loading}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        )}

        <FlatList
          data={data}
          keyExtractor={item => item.cardCode}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.list, data.length === 0 && s.listEmpty]}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.name}>{item.cardName}</Text>

              {!!item.phone1 && <Text style={s.sub}>{item.phone1}</Text>}
              {!!item.phone2 && <Text style={s.sub}>{item.phone2}</Text>}

              <Text style={s.balance}>
                Balans: {item.balance} {item.currency}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            !clients.isFetching ? (
              <View style={s.empty}>
                <Text style={s.hint}>Topilmadi</Text>
              </View>
            ) : null
          }
        />
      </SafeArea>
    </ProtectedScreen>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },

  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 4,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    paddingTop: 12,
    paddingBottom: 16,
  },

  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  sub: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },

  balance: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },

  empty: {
    alignItems: 'center',
  },

  hint: {
    color: colors.textSecondary,
  },
});
