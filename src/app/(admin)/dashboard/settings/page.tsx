export const metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Placeholder admin settings page.
        </p>
      </div>
      <div className="border-border rounded-2xl border bg-white p-8 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        Site settings management will be implemented in a later milestone.
      </div>
    </section>
  );
}
