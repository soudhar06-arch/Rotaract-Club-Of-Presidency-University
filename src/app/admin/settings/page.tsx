"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, RefreshCw, CheckCircle, Building, Mail, Phone, Link2, Share2 } from "lucide-react";
import { SiteConfig } from "@/lib/cms-store";

export default function SettingsAdminPage() {
  const [config, setConfig] = useState<Partial<SiteConfig>>({
    universityAddress: "",
    phone: "",
    email: "",
    membershipFormUrl: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadConfig = useCallback(() => {
    setLoading(true);
    fetch("/api/admin?module=config")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setConfig(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin?module=config")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setConfig(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "config", action: "update", payload: config }),
      });

      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS Global Settings
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Site Configuration & Contact Info
          </h1>
        </div>

        <button
          onClick={loadConfig}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
          title="Refresh Settings"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Site settings successfully updated and saved to disk persistence!</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading settings...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Contact Info Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-[#3B82F6]" />
              <span>Official Contact & Address</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  University Address
                </label>
                <textarea
                  rows={3}
                  value={config.universityAddress || ""}
                  onChange={(e) => setConfig({ ...config, universityAddress: e.target.value })}
                  placeholder="Presidency University Campus, Dibburu, Itgalpur..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
                    Official Phone Number
                  </label>
                  <input
                    value={config.phone || ""}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    placeholder="+91 8884466773"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={config.email || ""}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    placeholder="rotaractcpu@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Membership Integration Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-[#3B82F6]" />
              <span>Membership Registration Form</span>
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Official Google Form URL
              </label>
              <input
                type="url"
                value={config.membershipFormUrl || ""}
                onChange={(e) => setConfig({ ...config, membershipFormUrl: e.target.value })}
                placeholder="https://forms.google.com/..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                This URL is used by the &quot;Apply for Membership&quot; buttons across the website.
              </p>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#3B82F6]" />
              <span>Social Handles & Integrations</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  value={config.instagram || ""}
                  onChange={(e) => setConfig({ ...config, instagram: e.target.value })}
                  placeholder="https://instagram.com/rotaract_presidency"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  LinkedIn Page URL
                </label>
                <input
                  value={config.linkedin || ""}
                  onChange={(e) => setConfig({ ...config, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/rotaract-presidency"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 shadow-lg shadow-[#3B82F6]/30 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
