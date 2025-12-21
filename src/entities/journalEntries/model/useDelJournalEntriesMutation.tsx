import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delJournalEntriesApi } from '../api/journalEntries.api';
import { journalEntriesKeys } from './queryKeys';

export function useDelJournalEntryMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (jdtNum: number) => delJournalEntriesApi(jdtNum),
    onSuccess: async () => {
      // barcha journal-entry query larni yangilaydi
      await qc.invalidateQueries({ queryKey: journalEntriesKeys.all });
    },
  });
}
