"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { MotionProvider } from "./motion-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>{children}</MotionProvider>
    </ThemeProvider>
  );
}
