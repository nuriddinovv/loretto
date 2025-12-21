// cashReport.api.ts
import {
  DelJournalEntriesResponse,
  JournalEntriesResponse,
  http,
} from '@/shared';

export type JournalEntriesParams = {
  accountCode: number | string;
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
};

export async function getJournalEntriesApi(params: JournalEntriesParams) {
  const res = await http.get<JournalEntriesResponse>('/JournalEntries', {
    params: {
      accountCode: params.accountCode,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    },
  });
  return res.data;
}

export async function delJournalEntriesApi(params: number) {
  const res = await http.delete<DelJournalEntriesResponse>(
    `/JournalEntries/Cancel/${params}`,
    {},
  );
  return res.data;
}
