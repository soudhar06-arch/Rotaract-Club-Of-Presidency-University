import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="border-border max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          The requested route is not part of the scaffold yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
