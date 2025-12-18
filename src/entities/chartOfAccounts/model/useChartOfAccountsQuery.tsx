// src/entities/Clients/model/useClientsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { chartOfAccountKeys } from './queryKeys';
import { getChartOfAccountsApi } from '../api/chartOfAccounts.api';

export function useChartOfAccountsQuery(q: string) {
  const query = q.trim();

  return useQuery({
    queryKey: chartOfAccountKeys.search(query),
    queryFn: () => getChartOfAccountsApi(query),
    staleTime: 30_000,
  });
}
