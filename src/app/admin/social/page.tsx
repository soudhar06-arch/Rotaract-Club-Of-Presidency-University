"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Save, Share2 } from "lucide-react";

type SocialConfig = { instagram?: string; linkedin?: string; youtube?: string };

export default function SocialAdminPage() {
  const [links, setLinks] = useState<SocialConfig>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin?module=config")
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) throw new Error(result.error || "Could not load social links.");
        setLinks({ instagram: result.data?.instagram || "", linkedin: result.data?.linkedin || "", youtube: result.data?.youtube || "" });
      })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Could not load social links."));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await adminFetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "config", action: "update", payload: links }) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Could not save social links.");
      setMessage("Social links saved. Public components will use the same site configuration.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save social links.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-white/10 pb-6"><span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#3B82F6]">CMS Social Networks</span><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">Social Links & Handles</h1></div>
      {message && <div className="flex gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{message}</div>}
      {error && <div className="flex gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      <form onSubmit={save} className="space-y-5 rounded-3xl border border-white/10 bg-[#0E121E]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4"><Share2 className="h-5 w-5 text-[#3B82F6]" /><div><h2 className="text-base font-bold text-white">Public profiles</h2><p className="text-xs text-zinc-400">Leave a field empty to remove that public link.</p></div></div>
        {(["instagram", "linkedin", "youtube"] as const).map((platform) => <label key={platform} className="block"><span className="mb-1 block text-xs font-mono uppercase text-zinc-400">{platform} URL</span><input type="url" value={links[platform] || ""} onChange={(event) => setLinks({ ...links, [platform]: event.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white" placeholder={`https://${platform}.com/...`} /></label>)}
        <div className="flex justify-end border-t border-white/10 pt-4"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600"><Save className="h-4 w-4" />Save social links</button></div>
      </form>
    </div>
  );
}
