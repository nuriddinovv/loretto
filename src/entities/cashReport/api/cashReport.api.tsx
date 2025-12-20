// cashReport.api.ts
import { CashReportResponse, http } from '@/shared';

export type CashReportParams = {
  accountCode: number | string;
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
};

export async function getCashReportApi(params: CashReportParams) {
  const res = await http.get<CashReportResponse>('/CashReport', {
    params: {
      accountCode: params.accountCode,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    },
  });
  return res.data;
}
