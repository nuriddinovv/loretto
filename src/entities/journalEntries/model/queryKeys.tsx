// queryKeys.ts
export const journalEntriesKeys = {
  all: ['journal-entry'] as const,
  query: (params: {
    accountCode: number | string;
    dateFrom: string;
    dateTo: string;
  }) => [...journalEntriesKeys.all, 'query', params] as const,
};
