export const metadata = {
  title: "Events Management",
};

export default function AdminEventsPage() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Events</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Placeholder admin events page.
          </p>
        </div>
      </div>
      <div className="border-border rounded-2xl border bg-white p-8 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        Admin CRUD for events will be implemented in a later milestone.
      </div>
    </section>
  );
}
