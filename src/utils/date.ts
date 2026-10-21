export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}
export function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return dateKey(d);
  });
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
export const money = (amount: number) =>
  `€${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
export const validPlace = (value: string) =>
  /^(?:[1-8]|1[1-6]|2[1-6]|3[1-4])$/.test(value.trim());
