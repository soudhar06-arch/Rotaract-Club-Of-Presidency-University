"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Save, CheckCircle2 } from "lucide-react";
import { CMSStore } from "@/lib/cms-store";

export default function ContactAdminPage() {
  const currentConfig = CMSStore.getConfig();
  const [address, setAddress] = useState(currentConfig.universityAddress);
  const [phone, setPhone] = useState(currentConfig.phone);
  const [email, setEmail] = useState(currentConfig.email);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CMSStore.updateConfig({
      universityAddress: address,
      phone,
      email,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          CMS Communication & Contact
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          University Address & Contact Information
        </h1>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>Contact details updated successfully! Public website reflects these changes.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-6 shadow-2xl">
        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3B82F6]" />
            UNIVERSITY ADDRESS (Official Label)
          </label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6]"
          />
          <p className="mt-1.5 text-[11px] text-zinc-500">
            Note: This label must remain &quot;UNIVERSITY ADDRESS&quot; (never labeled Headquarters).
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#3B82F6]" />
              Official Phone Number
            </label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3B82F6]" />
              Official Club Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/30"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
