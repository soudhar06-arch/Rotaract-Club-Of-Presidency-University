import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation";
import { Footer } from "@/components/layout";
import { AIAssistant } from "@/components/shared";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[color:var(--color-bg-primary)]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <AIAssistant />
      <Footer />
    </div>
  );
}
