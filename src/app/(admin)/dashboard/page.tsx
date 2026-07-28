export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Placeholder overview page for the admin dashboard.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Events", value: "0" },
          { label: "Albums", value: "0" },
          { label: "Pending Applications", value: "0" },
        ].map((card) => (
          <div
            key={card.label}
            className="border-border rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
