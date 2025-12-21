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
import { debouncedValue, goBack, SafeArea, colors } from '@/shared';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useChartOfAccountsQuery } from '@/entities';
import { ProtectedScreen } from '@/shared/ui';

export function ChartOfAccountsScreen() {
  const nav = useNavigation();
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Plan schetov',
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

  const chartOfAccounts = useChartOfAccountsQuery(dq);

  const data = useMemo(
    () => chartOfAccounts.data ?? [],
    [chartOfAccounts.data],
  );

  return (
    <ProtectedScreen requiredPermission="chartsOfAccounts">
      <SafeArea edges={['bottom']} style={s.container}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Qidirish..."
          style={s.search}
          placeholderTextColor={'#000'}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />

        {chartOfAccounts.isFetching && (
          <View style={s.loading}>
            <ActivityIndicator size={'large'} color={colors.primary} />
          </View>
        )}

        <FlatList
          data={data}
          keyExtractor={item => item.acctCode}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.list, data.length === 0 && s.listEmpty]}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.name}>
                {item.acctCode} - {item.acctName}
              </Text>

              <Text style={s.balance}>
                Balans: {item.balanceUSD.toLocaleString()} USD
              </Text>
              <Text style={s.balance}>
                Balans: {item.balance.toLocaleString()} UZS
              </Text>
            </View>
          )}
          ListEmptyComponent={
            !chartOfAccounts.isFetching ? (
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
