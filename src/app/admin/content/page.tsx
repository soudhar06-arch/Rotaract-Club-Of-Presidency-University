"use client";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import type { CalendarEvent } from "@/lib/google-calendar";

export default function ContentTools() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    const data = await (await adminFetch("/api/admin/content")).json();
    setEvents((data.events || []).filter((event: CalendarEvent) => event.source !== "calendar"));
    setWarnings([...(data.errors || []), ...(data.warnings || [])]);
  }, []);
  useEffect(() => { const timer = setTimeout(() => { void load(); }, 0); return () => clearTimeout(timer); }, [load]);
  async function action(payload: Record<string, unknown>) {
    setBusy(String(payload.id || payload.action)); setMessage("");
    try {
      const result = await (await adminFetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })).json();
      if (result.success) { setMessage(payload.action === "import" ? `Imported ${result.count} source entries.` : "Saved. Public event views will use the latest content."); await load(); }
    } finally { setBusy(null); }
  }
  return <div className="max-w-5xl space-y-6">
    <h1 className="text-3xl font-bold">Event sources & Leviathan Bot content</h1>
    <p className="text-sm text-zinc-400">Each event folder is one event. Import the authoritative event-details JSON, then generate summaries using the same AI service as Leviathan Bot. Summaries select source sentences; facts are never fabricated.</p>
    <div className="flex flex-wrap gap-3">
      <button disabled={!!busy} onClick={() => action({ action: "refresh" })} className="rounded-full bg-white/10 px-5 py-2 text-sm">Refresh sources</button>
      <label className="cursor-pointer rounded-full bg-blue-500 px-5 py-2 text-sm">Import event-details JSON<input className="sr-only" type="file" accept="application/json,.json" disabled={!!busy} onChange={async e => {
        const file = e.target.files?.[0]; if (!file) return;
        try { if (file.size > 2 * 1024 * 1024) throw new Error("Details files must be smaller than 2 MB."); await action({ action: "import", content: JSON.parse(await file.text()) }); }
        catch (error) { setMessage(error instanceof Error ? error.message : "Invalid JSON file."); }
        e.target.value = "";
      }} /></label>
    </div>
    <p className="text-xs text-zinc-400">JSON: an array of records with title, description and optional folderId, folderName, date (YYYY-MM-DD), time, category, venue, platform, participants, beneficiaries, collaborators and registrationLink. Import replaces the current details document. Match by folder ID or a unique normalized folder name.</p>
    {message && <p role="status" className="rounded-xl border border-blue-500/30 p-4 text-sm">{message}</p>}
    {!!warnings.length && <details className="rounded-xl border border-white/10 p-4"><summary>Source diagnostics ({warnings.length})</summary><ul className="mt-3 space-y-2 text-sm text-zinc-400">{warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></details>}
    <div className="grid gap-4 md:grid-cols-2">{events.map(event => <article key={event.id} className="space-y-3 rounded-2xl border border-white/10 bg-[#0E121E] p-5">
      <h2 className="font-semibold">{event.title}</h2><p className="text-xs text-zinc-400">{event.source} · {event.images.length} photos</p>
      <p className="line-clamp-3 text-sm text-zinc-300">{event.shortDescription || event.description || "No source description. Import event details or edit the CMS record."}</p>
      <button disabled={!!busy || !event.description} onClick={() => action({ action: "generate", id: event.id, regenerate: true })} className="rounded-full bg-blue-500 px-4 py-2 text-xs disabled:opacity-40">{busy === event.id ? "Generating…" : "Generate / regenerate summary"}</button>
    </article>)}</div>
  </div>;
}
