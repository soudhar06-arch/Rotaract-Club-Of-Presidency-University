import "server-only";

const entries = new Map<string, { expires: number; value: Promise<unknown> }>();
export function cached<T>(key: string, ttlMs: number, read: () => Promise<T>): Promise<T> {
  const existing = entries.get(key);
  if (existing && existing.expires > Date.now()) return existing.value as Promise<T>;
  const value = read().catch((error) => { entries.delete(key); throw error; });
  entries.set(key, { expires: Date.now() + ttlMs, value });
  return value;
}
export function clearDataCache() { entries.clear(); }
