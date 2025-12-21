import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  exchangeCurrencyApi,
  type ExchangeCurrencyPayload,
} from '../api/exchangeCurrency.api';

export function useExchangeCurrencyMutation() {
  return useMutation({
    mutationFn: (payload: ExchangeCurrencyPayload) =>
      exchangeCurrencyApi(payload),

    onSuccess: (res) => {
      if (res.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Muvaffaqiyatli',
          text2: 'Amaliyot muvaffaqiyatli bajarildi',
        });
      } else if (res.status === 'error') {
        Toast.show({
          type: 'error',
          text1: 'Xato',
          text2: res.error?.message ?? 'Noma\'lum xatolik',
        });
      }
    },

    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Xato',
        text2: err?.message ?? 'Amaliyotni bajarishda xatolik yuz berdi',
      });
    },
  });
}


