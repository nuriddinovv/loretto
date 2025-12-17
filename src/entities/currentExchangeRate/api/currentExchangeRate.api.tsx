import { ExchangeRate, http } from '@/shared';

export async function getCurrentExchangeRate(): Promise<ExchangeRate> {
  const { data } = await http.get<ExchangeRate>('/CurrentExchangeRate');
  return data;
}
