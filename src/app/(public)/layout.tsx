import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation";
import { Footer } from "@/components/layout";
import { CinematicBackground } from "@/components/shared";
import Preloader from "@/components/shared/preloader";
import LazyAIAssistant from "@/components/shared/lazy-ai-assistant";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505] text-white">
      <Preloader />
      <CinematicBackground />
      <Navbar />
      <main className="flex-1">{children}</main>
      <LazyAIAssistant />
      <Footer />
    </div>
  );
}
