import { http } from '@/shared/api';
import { LoginResponse } from '@/shared/api/types';

export type LoginPayload = {
  UserName: string;
  Password: string;
  CompanyDB: string;
};

export async function loginApi(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/Login', payload);

  return data;
}
