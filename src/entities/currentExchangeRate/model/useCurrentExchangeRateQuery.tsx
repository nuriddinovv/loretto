import { useQuery } from '@tanstack/react-query';
import { getCurrentExchangeRate } from '../api/currentExchangeRate.api';

export function useCurrentExchangeRateQuery() {
  return useQuery({
    queryKey: ['exchange-rate', 'current'],
    queryFn: getCurrentExchangeRate,
    staleTime: 60_000,
  });
}
