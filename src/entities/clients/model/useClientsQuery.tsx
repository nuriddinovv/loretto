// src/entities/Clients/model/useClientsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { clientKeys } from './queryKeys';
import { getClientsApi } from '../api/clients.api';

export function useClientsQuery(q: string) {
  const query = q.trim();

  return useQuery({
    queryKey: clientKeys.search(query),
    queryFn: () => getClientsApi(query),
    staleTime: 30_000,
  });
}
