import { ChartOfAccount, http } from '@/shared';

export async function getChartOfAccountsApi(q: string) {
  const res = await http.get<ChartOfAccount[]>('/ChartOfAccounts', {
    params: { q },
  });
  return res.data;
}
