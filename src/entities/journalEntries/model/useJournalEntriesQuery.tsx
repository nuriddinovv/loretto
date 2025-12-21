// useCashReportQuery.ts
import { useQuery } from '@tanstack/react-query';
import {
  getJournalEntriesApi,
  JournalEntriesParams,
} from '../api/journalEntries.api';
import { journalEntriesKeys } from './queryKeys';

export function useJournalEntriesQuery(params?: JournalEntriesParams) {
  const enabled =
    !!params?.accountCode && !!params?.dateFrom && !!params?.dateTo;

  return useQuery({
    queryKey: enabled
      ? journalEntriesKeys.query({
          accountCode: params!.accountCode,
          dateFrom: params!.dateFrom,
          dateTo: params!.dateTo,
        })
      : journalEntriesKeys.all, // enabled bo‘lmaganda stable key
    queryFn: () => getJournalEntriesApi(params!),
    enabled,
    staleTime: 30_000,
  });
}
