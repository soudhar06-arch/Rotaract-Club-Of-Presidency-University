import Link from "next/link";
import { ArrowRight, LayoutGrid, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:px-8">
      <div className="border-border rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12 dark:border-slate-800 dark:bg-slate-900/70">
        <p className="border-border mb-4 inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <ShieldCheck size={16} /> Scaffold ready for implementation
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Rotaract Club foundation is now scaffolded for the planned public site
          and admin dashboard.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          This placeholder home route marks the start of the implementation
          phase without adding business logic, auth, or UI features.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            Explore public routes <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="border-border inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LayoutGrid size={16} /> Open dashboard scaffold
          </Link>
        </div>
      </div>
    </main>
  );
}
