import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth, useCurrency, useCurrentExchangeRateQuery } from '@/entities';
import { colors } from '@/shared';
import { HomeMenuGrid } from '@/widgets';
import { SetRateModal } from '@/features';

export function HomeScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Loretto Kassa',
      headerShadowVisible: false,
    });
  }, [navigation]);

  const rateQuery = useCurrentExchangeRateQuery();
  const { setRate } = useCurrency();
  const { can } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!rateQuery.isSuccess) return;

    const currentRate = rateQuery.data?.rate ?? null;
    //@ts-ignore
    setRate(currentRate);

    // SHART: kurs yo‘q bo‘lsa va setRate permission bo‘lsa modal ochamiz
    if (currentRate == null && can('setRate')) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [rateQuery.isSuccess, rateQuery.data?.rate, can, setRate]);

  return (
    <View style={s.container}>
      {rateQuery.isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <HomeMenuGrid />
      )}

      <SetRateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode="today"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loading: { flex: 1, justifyContent: 'center' },
});
