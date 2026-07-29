export const designTokens = {
  colors: {
    brand: {
      accentBlue: "#3B82F6",
      accentBlueHover: "#2563EB",
      rotaryGold: "#F5A623",
    },
    version2: {
      bgPrimary: "#050505",
      bgSecondary: "#0A0A0A",
      surface: "#101010",
      cards: "#151515",
      glass: "rgba(255, 255, 255, 0.04)",
      glassElevated: "rgba(255, 255, 255, 0.07)",
      textPrimary: "#FFFFFF",
      textSecondary: "#D4D4D4",
      textMuted: "#9A9A9A",
      borders: "rgba(255, 255, 255, 0.08)",
      bordersActive: "rgba(59, 130, 246, 0.4)",
    },
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
  },
  typography: {
    fonts: {
      display: "var(--font-geist-sans), -apple-system, sans-serif",
      body: "var(--font-inter), -apple-system, sans-serif",
      mono: "var(--font-jetbrains-mono), monospace",
    },
  },
  radius: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    "2xl": "32px",
    full: "9999px",
  },
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    sm: "0 4px 12px -2px rgba(0, 0, 0, 0.5)",
    md: "0 12px 32px -8px rgba(0, 0, 0, 0.7)",
    lg: "0 24px 64px -12px rgba(0, 0, 0, 0.85)",
    glowBlue: "0 0 50px -10px rgba(59, 130, 246, 0.35)",
    glassCard: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
  animation: {
    durations: {
      fast: "150ms",
      standard: "220ms",
      smooth: "350ms",
      slow: "500ms",
    },
    curves: {
      standard: "cubic-bezier(0.16, 1, 0.3, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
