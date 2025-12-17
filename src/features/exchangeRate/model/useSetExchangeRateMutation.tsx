import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  setExchangeRateApi,
  type SetExchangeRatePayload,
} from '../api/setExchangeRate.api';
import { useCurrency } from '@/entities';

export function useSetExchangeRateMutation() {
  const qc = useQueryClient();
  const { setRate } = useCurrency();

  return useMutation({
    mutationFn: (p: SetExchangeRatePayload) => setExchangeRateApi(p),

    onSuccess: async (_res, variables) => {
      setRate(variables.Rate);
      await qc.invalidateQueries({ queryKey: ['exchange-rate', 'current'] });

      await qc.invalidateQueries({ queryKey: ['exchange-rates'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Kurs saqlandi',
      });
    },

    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message ?? 'Noma’lum xatolik',
      });
    },
  });
}
