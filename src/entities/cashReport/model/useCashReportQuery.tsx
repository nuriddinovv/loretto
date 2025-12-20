// useCashReportQuery.ts
import { useQuery } from '@tanstack/react-query';
import { cashReportKeys } from './queryKeys';
import { getCashReportApi, type CashReportParams } from '../api/cashReport.api';

export function useCashReportQuery(params?: CashReportParams) {
  const enabled =
    !!params?.accountCode && !!params?.dateFrom && !!params?.dateTo;

  return useQuery({
    queryKey: enabled
      ? cashReportKeys.query({
          accountCode: params!.accountCode,
          dateFrom: params!.dateFrom,
          dateTo: params!.dateTo,
        })
      : cashReportKeys.all, // enabled bo‘lmaganda stable key
    queryFn: () => getCashReportApi(params!),
    enabled,
    staleTime: 30_000,
  });
}
