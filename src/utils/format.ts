import { format, parseISO } from "date-fns";

export function formatDate(date: string | Date, formatStr = "PPP"): string {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return String(date);
  }
}

export function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
