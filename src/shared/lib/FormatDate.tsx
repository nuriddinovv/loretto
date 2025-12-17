export function formatDate(date?: string | null): string {
  if (!date) return '';

  const clean = String(date).split(' ')[0]; // "2026-01-13"
  const [year, month, day] = clean.split('-');

  if (!year || !month || !day) return '';

  return `${day}.${month}.${year}`;
}
