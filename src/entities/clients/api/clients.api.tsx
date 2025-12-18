import { Client, http } from '@/shared';

export async function getClientsApi(q: string) {
  const res = await http.get<Client[]>('/BusinessPartners', {
    params: { q },
  });
  return res.data;
}
