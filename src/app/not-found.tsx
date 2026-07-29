import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <div className="shadow-large w-full max-w-lg rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-10">
        <span className="mb-2 block text-6xl font-extrabold text-[color:var(--color-brand-rotary-gold)]">
          404
        </span>
        <h1 className="text-heading-xl mb-3 font-bold text-[color:var(--color-text-primary)]">
          Page Not Found
        </h1>
        <p className="text-body-small mb-8 text-[color:var(--color-text-secondary)]">
          The page you are looking for does not exist or has been moved to
          another location.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[color:var(--color-brand-accent-blue)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
