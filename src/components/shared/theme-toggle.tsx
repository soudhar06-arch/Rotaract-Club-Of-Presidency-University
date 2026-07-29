"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useMounted } from "@/hooks";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[color:var(--color-border)] bg-transparent" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-bg-secondary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-rotary-gold)] focus-visible:outline-none active:scale-95"
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4 scale-100 rotate-0 text-[color:var(--color-brand-rotary-gold)] transition-transform" />
      ) : (
        <Moon className="h-4 w-4 scale-100 rotate-0 text-[color:var(--color-brand-accent-blue)] transition-transform" />
      )}
    </button>
  );
}
