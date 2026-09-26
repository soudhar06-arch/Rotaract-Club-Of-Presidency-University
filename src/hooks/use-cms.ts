"use client";
import { useEffect, useState } from "react";

export function useCMS<T>(module: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch(`/api/cms?module=${encodeURIComponent(module)}`, { cache: "no-store" });
        const result = await response.json();
        if (!result.success) throw new Error("Content is temporarily unavailable.");
        if (active) { setData(result.data); setError(null); }
      } catch { if (active) setError("Content is temporarily unavailable."); }
      finally { if (active) setLoading(false); }
    };
    void refresh();
    const timer = setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [module]);
  return { data, error, loading };
}
