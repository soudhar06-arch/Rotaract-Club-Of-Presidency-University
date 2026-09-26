import "server-only";
const limits = new Map<string, { count: number; expires: number }>();
export function rateLimited(request: Request, action: string, maximum = 20) {
  const now = Date.now();
  for (const [key, item] of limits) if (item.expires <= now) limits.delete(key);
  const key = `${action}:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"}`;
  const current = limits.get(key) || { count: 0, expires: now + 60000 };
  current.count++; limits.set(key, current);
  return current.count > maximum;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
