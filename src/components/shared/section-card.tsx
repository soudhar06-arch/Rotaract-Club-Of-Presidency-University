type SectionCardProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <div className="border-border rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
