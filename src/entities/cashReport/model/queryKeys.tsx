// queryKeys.ts
export const cashReportKeys = {
  all: ['cash-report'] as const,
  query: (params: {
    accountCode: number | string;
    dateFrom: string;
    dateTo: string;
  }) => [...cashReportKeys.all, 'query', params] as const,
};

