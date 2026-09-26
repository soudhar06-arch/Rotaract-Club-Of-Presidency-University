"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Save, X, RefreshCw, HelpCircle } from "lucide-react";
import { FAQItem } from "@/lib/cms-store";

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: "",
    answer: "",
    category: "General",
  });

  const loadFAQs = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin?module=faq")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setFaqs(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    adminFetch("/api/admin?module=faq")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore) setLoading(false);
        if (!ignore && res.success) {
          setFaqs(res.data);
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
    if (!formData.question || !formData.answer) return;

    const action = editingFaq ? "update" : "create";
    const payload = editingFaq ? { ...editingFaq, ...formData } : formData;

    const res = await adminFetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "faq", action, payload }),
    });

    const data = await res.json();
    if (data.success) {
      setEditingFaq(null);
      setIsAdding(false);
      loadFAQs();
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete FAQ: "${question}"?`)) return;

    const res = await adminFetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "faq", action: "delete", payload: { id } }),
    });

    const data = await res.json();
    if (data.success) loadFAQs();
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS FAQ Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Frequently Asked Questions ({faqs.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadFAQs}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingFaq(null);
              setFormData({
                question: "",
                answer: "",
                category: "General",
              });
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Form Modal */}
      {(isAdding || editingFaq) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0F121C] p-6 sm:p-8 space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingFaq(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingFaq ? "Edit FAQ Item" : "Add FAQ Item"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Question *
                </label>
                <input
                  required
                  value={formData.question || ""}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How do I apply for Rotaract membership?"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category
                </label>
                <input
                  value={formData.category || "General"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="General / Membership / Events"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ""}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a clear, detailed answer..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingFaq(null);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 shadow-lg shadow-[#3B82F6]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save FAQ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading FAQ items...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#3B82F6]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 font-bold">
                    {faq.category}
                  </span>
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">{faq.question}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button
                  onClick={() => {
                    setEditingFaq(faq);
                    setFormData(faq);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(faq.id, faq.question)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
