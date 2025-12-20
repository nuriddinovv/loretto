import { http } from '@/shared/api';

export type ExchangeCurrencyPayload = {
  type: 'from_uzs' | 'to_uzs';
  fromAccount: string;
  fromAmount: number;
  toAccount: string;
  toAmount: number;
  transitAccount: string;
};

export type ExchangeCurrencyResponse = {
  status: 'success' | 'error';
  error?: {
    message: string;
  };
};

export async function exchangeCurrencyApi(
  payload: ExchangeCurrencyPayload,
): Promise<ExchangeCurrencyResponse> {
  const { data } = await http.post<ExchangeCurrencyResponse>(
    '/ExchangeCurrency',
    payload,
  );
  return data;
}
