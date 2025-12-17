import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '../api/exchangeRates.api';

export function useExchangeRatesQuery() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: getExchangeRates,
    staleTime: 30_000,
  });
}
