const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const AVAILABLE_WEEKDAYS = new Set([1, 3, 4]); // Monday, Wednesday, Thursday

function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE_PATTERN.test(value)) return null;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isDateUnavailable(isoDate: string): boolean {
  const parsedDate = parseIsoDate(isoDate);
  if (!parsedDate) return false;

  return !AVAILABLE_WEEKDAYS.has(parsedDate.getUTCDay());
}

export function getDateUnavailableMessage(isoDate: string): string {
  if (!isDateUnavailable(isoDate)) return "";
  return "Charters are only available on Monday, Wednesday, and Thursday.";
}
