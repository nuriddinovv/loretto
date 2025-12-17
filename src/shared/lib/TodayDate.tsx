export function todayDate(): string {
  const d = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  return `${d} 00:00:00.000000000`;
}
