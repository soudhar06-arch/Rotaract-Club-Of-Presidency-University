"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Save, X, RefreshCw, Calendar, MapPin, Users } from "lucide-react";
import { EventItem } from "@/lib/cms-store";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    venue: "Presidency University",
    platform: "",
    category: "Fellowship",
    participants: 0,
    description: "",
  });

  const loadEvents = useCallback(() => {
    setLoading(true);
    fetch("/api/admin?module=events")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin?module=events")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setEvents(res.data);
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
    if (!formData.title || !formData.date) return;

    const action = editingEvent ? "update" : "create";
    const payload = editingEvent ? { ...editingEvent, ...formData } : formData;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "events", action, payload }),
    });

    const data = await res.json();
    if (data.success) {
      setEditingEvent(null);
      setIsAdding(false);
      loadEvents();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete historical event: ${title}?`)) return;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "events", action: "delete", payload: { id } }),
    });

    const data = await res.json();
    if (data.success) loadEvents();
  };

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.category.toLowerCase().includes(search.toLowerCase()) ||
      (ev.venue && ev.venue.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS Historical Events
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Conducted Events ({events.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEvents}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                title: "",
                date: new Date().toISOString().split("T")[0],
                venue: "Presidency University",
                platform: "",
                category: "Fellowship",
                participants: 0,
                description: "",
              });
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search events by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0F121C] p-6 sm:p-8 space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingEvent(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingEvent ? `Edit Event — ${editingEvent.title}` : "Add Conducted Event"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Event Title *
                </label>
                <input
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Minute to Win"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || "Fellowship"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#151922] px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Fellowship">Fellowship</option>
                    <option value="Club Service">Club Service</option>
                    <option value="Sports">Sports</option>
                    <option value="International Service">International Service</option>
                    <option value="Professional Development">Professional Development</option>
                    <option value="Volunteering">Volunteering</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Physical Venue (if offline)
                  </label>
                  <input
                    value={formData.venue || ""}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. U-Block Auditorium"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Virtual Platform (if online)
                  </label>
                  <input
                    value={formData.platform || ""}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g. Google Meet / Discord"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Participant Count (Optional)
                </label>
                <input
                  type="number"
                  value={formData.participants || 0}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingEvent(null);
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
                <span>Save Event</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading historical events...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#3B82F6]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 font-bold">
                    {ev.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ev.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{ev.title}</h3>

                <div className="space-y-1 text-xs text-zinc-400">
                  {(ev.venue || ev.platform) && (
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>{ev.venue || ev.platform}</span>
                    </div>
                  )}
                  {Boolean(ev.participants) && (
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>{ev.participants} Attendees</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button
                  onClick={() => {
                    setEditingEvent(ev);
                    setFormData(ev);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(ev.id, ev.title)}
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
