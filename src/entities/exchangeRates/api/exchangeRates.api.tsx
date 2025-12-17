import { ExchangeRate, http } from '@/shared';

export async function getExchangeRates(): Promise<ExchangeRate[]> {
  const { data } = await http.get<ExchangeRate[]>('/ExchangeRates');
  return data;
}
