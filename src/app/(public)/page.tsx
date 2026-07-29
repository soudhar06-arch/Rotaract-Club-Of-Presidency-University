import Link from "next/link";
import { ArrowRight, LayoutGrid, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell
      title="Production-ready foundation for the Rotaract platform"
      description="This scaffold provides the app shell, design tokens, theme system, and architectural structure required by the implementation roadmap without introducing feature pages or business logic."
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur sm:p-10 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <ShieldCheck size={16} className="text-[#003f87]" />
          Foundation ready for implementation
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          The base project now includes a typed app layout, centralized tokens,
          dark mode support, loading/error states, and an organized folder
          structure aligned to the project documentation.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-[#003f87] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#002f68]"
          >
            Explore public routes <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LayoutGrid size={16} /> Open dashboard scaffold
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
