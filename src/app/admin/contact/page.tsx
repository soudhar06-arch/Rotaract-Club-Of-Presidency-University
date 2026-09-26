"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactAdminPage() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin?module=config")
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) throw new Error(result.error || "Could not load contact settings.");
        if (result.data) {
          setAddress(result.data.universityAddress || "");
          setPhone(result.data.phone || "");
          setEmail(result.data.email || "");
        }
      })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Could not load contact settings."));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setError("");
    try {
      const response = await adminFetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "config", action: "update", payload: { universityAddress: address, phone, email } }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Could not save contact settings.");
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save contact settings.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#3B82F6]">CMS Communication & Contact</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">University Address & Contact Information</h1>
      </div>
      {saved && <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400"><CheckCircle2 className="h-5 w-5" />Contact details saved. The public CMS will use the new values.</div>}
      {error && <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300"><AlertCircle className="h-5 w-5" />{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-[#0E121E]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div><label className="mb-2 flex items-center gap-2 text-xs font-mono font-semibold uppercase text-zinc-400"><MapPin className="h-4 w-4 text-[#3B82F6]" />University address</label><textarea required rows={3} value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white focus:border-[#3B82F6] focus:outline-none" /></div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label className="mb-2 flex items-center gap-2 text-xs font-mono font-semibold uppercase text-zinc-400"><Phone className="h-4 w-4 text-[#3B82F6]" />Official phone</label><input required value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white" /></div>
          <div><label className="mb-2 flex items-center gap-2 text-xs font-mono font-semibold uppercase text-zinc-400"><Mail className="h-4 w-4 text-[#3B82F6]" />Official email</label><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white" /></div>
        </div>
        <div className="flex justify-end border-t border-white/10 pt-4"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#3B82F6]/30 transition-colors hover:bg-blue-600"><Save className="h-4 w-4" />Save contact settings</button></div>
      </form>
    </div>
  );
}
