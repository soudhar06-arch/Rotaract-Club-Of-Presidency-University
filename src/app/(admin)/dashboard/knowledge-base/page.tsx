export const metadata = {
  title: "Knowledge Base",
};

export default function AdminKnowledgeBasePage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">AI Knowledge Base</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Placeholder admin knowledge base page.
        </p>
      </div>
      <div className="border-border rounded-2xl border bg-white p-8 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        Document upload and chatbot integration will be implemented in a later
        milestone.
      </div>
    </section>
  );
}
