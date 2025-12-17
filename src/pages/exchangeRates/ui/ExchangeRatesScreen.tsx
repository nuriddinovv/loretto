import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus } from 'lucide-react-native';

import { useAuth, useExchangeRatesQuery } from '@/entities';
import { colors, formatDate, goBack } from '@/shared';
import { SetRateModal } from '@/features';
import { useQueryClient } from '@tanstack/react-query';

type RateItem = {
  currency: string;
  rateDate: string;
  rate: number | string | null;
};

export function ExchangeRatesScreen() {
  const nav = useNavigation();
  const { can } = useAuth();
  const rates = useExchangeRatesQuery();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<RateItem | null>(null);

  const canSetRate = useMemo(() => can('setRate'), [can]);

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Valyuta kursi',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={goBack} style={{ paddingHorizontal: 10 }}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
      ),
      headerRight: () =>
        canSetRate ? (
          <TouchableOpacity
            onPress={() => {
              setSelected(null);
              setModalVisible(true);
            }}
            style={{ paddingHorizontal: 10 }}
          >
            <Plus color={colors.textPrimary} size={24} />
          </TouchableOpacity>
        ) : null,
    });
  }, [nav, canSetRate]);

  const handleSaved = async () => {
    closeModal();

    await queryClient.invalidateQueries({
      queryKey: ['exchangeRates'], // ⚠️ sizning real queryKey shu bo‘lishi kerak
    });
  };

  const openEditModal = (item: RateItem) => {
    setSelected(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  return (
    <View style={s.container}>
      {rates.isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={rates.data ?? []}
          keyExtractor={(item, idx) =>
            `${item.currency}-${item.rateDate}-${idx}`
          }
          contentContainerStyle={s.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <View style={s.card}>
                <Text style={s.date}>{formatDate(item.rateDate)}</Text>
                <Text style={s.rate}>
                  {Number(item.rate).toLocaleString()} {item.currency}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <SetRateModal
        visible={modalVisible}
        onClose={closeModal}
        onSaved={handleSaved}
        mode={selected ? 'today' : 'calendar'}
        title={selected ? formatDate(selected.rateDate) : 'Kurs qo‘shish'}
        initialRate={selected ? Number(selected.rate) : undefined}
        initialDate={selected ? selected.rateDate : undefined}
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  loading: { flex: 1, justifyContent: 'center' },
  listContent: { paddingBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currency: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  rate: { fontSize: 16, fontWeight: '700', color: colors.primary },
  date: { fontSize: 16, color: colors.textSecondary },
});
