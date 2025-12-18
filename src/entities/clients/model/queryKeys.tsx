export const clientKeys = {
  all: ['business-partners'] as const,
  search: (q: string) => [...clientKeys.all, 'search', q] as const,
};
