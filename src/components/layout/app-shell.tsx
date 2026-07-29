import type { ReactNode } from "react";

interface AppShellProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
      {(title || description) && (
        <header className="max-w-3xl space-y-3">
          {title ? (
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-4xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="text-base leading-7 text-[color:var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
