import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  journalEntriesApi,
  type JournalEntriesPayload,
} from '../api/journalEntries.api';

type UseJournalEntriesMutationOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useJournalEntriesMutation(
  options?: UseJournalEntriesMutationOptions,
) {
  return useMutation({
    mutationFn: (payload: JournalEntriesPayload) =>
      journalEntriesApi(payload),

    onSuccess: (res) => {
      if (res.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Muvaffaqiyatli',
          text2: 'Amaliyot muvaffaqiyatli bajarildi',
        });
        options?.onSuccess?.();
      } else if (res.status === 'error') {
        Toast.show({
          type: 'error',
          text1: 'Xato',
          text2: res.error?.message ?? res.message ?? 'Noma\'lum xatolik',
        });
        options?.onError?.();
      }
    },

    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Xato',
        text2: err?.message ?? 'Amaliyotni bajarishda xatolik yuz berdi',
      });
      options?.onError?.();
    },
  });
}

