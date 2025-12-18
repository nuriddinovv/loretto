export const chartOfAccountKeys = {
  all: ['chart-of-accounts'] as const,
  search: (q: string) => [...chartOfAccountKeys.all, 'search', q] as const,
};
