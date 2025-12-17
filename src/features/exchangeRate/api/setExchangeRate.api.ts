import { http } from '@/shared/api';

export type SetExchangeRatePayload = {
  Currency: 'UZS';
  Rate: number;
  RateDate: string;
};

export async function setExchangeRateApi(payload: SetExchangeRatePayload) {
  const { data } = await http.post('/SetExchangeRate', payload);
  return data;
}
