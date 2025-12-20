import { http } from '@/shared/api';
import type { InvoiceData } from '@/shared';

export type JournalEntriesPayload = {
  memo: string;
  referenceDate: string;
  journalEntryLines: InvoiceData[];
};

export type JournalEntriesResponse = {
  status: 'success' | 'error';
  error?: {
    message: string;
  };
  message?: string;
};

export async function journalEntriesApi(
  payload: JournalEntriesPayload,
): Promise<JournalEntriesResponse> {
  const { data } = await http.post<JournalEntriesResponse>(
    '/JournalEntries',
    payload,
  );
  return data;
}

