export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--color-border)] border-t-[color:var(--color-brand-accent-blue)]" />
      <p className="animate-pulse text-sm font-medium text-[color:var(--color-text-muted)]">
        Loading platform resources...
      </p>
    </div>
  );
}
