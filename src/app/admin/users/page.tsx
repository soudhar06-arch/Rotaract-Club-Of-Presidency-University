"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState, useCallback } from "react";
import { ShieldCheck, UserCheck, AlertCircle, RefreshCw } from "lucide-react";
import { UserAccount, Role } from "@/lib/cms-store";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "VIEWER" });
  const [saving, setSaving] = useState(false);
  async function accountAction(payload: Record<string, unknown>) {
    setSaving(true);
    try { const result = await (await adminFetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })).json(); if (result.success) { setNewUser({ name: "", email: "", password: "", role: "VIEWER" }); loadUsers(); } }
    finally { setSaving(false); }
  }

  const loadUsers = useCallback(() => {
    setErrorMsg("");
    adminFetch("/api/admin?module=users")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setUsers(res.data);
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load users");
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    adminFetch("/api/admin?module=users")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setUsers(res.data);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setErrorMsg(err instanceof Error ? err.message : "Failed to load users");
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setErrorMsg("");
    try {
      const res = await adminFetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "users",
          action: "update_role",
          payload: { userId, newRole },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Failed to update user role.");
      } else {
        loadUsers();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Role change failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            Security & Access Control
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            User Management & Roles
          </h1>
        </div>

        <button
          onClick={loadUsers}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); void accountAction({ action: "create", ...newUser }); }} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Create account</h2>
        <input aria-label="Account name" required placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="min-w-0 rounded-lg bg-black/30 p-3 text-sm" />
        <input aria-label="Account email" required type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="min-w-0 rounded-lg bg-black/30 p-3 text-sm" />
        <input aria-label="Account password" required type="password" minLength={12} autoComplete="new-password" placeholder="Password (12+ characters)" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="min-w-0 rounded-lg bg-black/30 p-3 text-sm" />
        <select aria-label="Account role" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="rounded-lg bg-[#151922] p-3 text-sm">{["OWNER", "ADMIN", "EDITOR", "VIEWER"].map(role => <option key={role}>{role}</option>)}</select>
        <button disabled={saving} className="rounded-full bg-blue-500 px-5 py-2 text-sm disabled:opacity-50">{saving ? "Saving?" : "Create account"}</button>
        <p className="text-xs text-zinc-400">OWNER manages access and settings. ADMIN manages content. EDITOR adds gallery media and event drafts. VIEWER has read access.</p>
      </form>
      {/* Users Table Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-base font-bold text-white">Authorized CMS Accounts</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">Total: {users.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Role Authorization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-bold text-xs">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border uppercase ${
                        u.role === "OWNER"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : u.role === "ADMIN"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : u.role === "EDITOR"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-white/10 text-zinc-400 border-white/20"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <UserCheck className="w-3.5 h-3.5" />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-500">{u.createdDate}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={u.role}
                      disabled={u.role === "OWNER" && users.filter((x) => x.role === "OWNER").length <= 1}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="rounded-xl border border-white/10 bg-[#151922] px-3 py-1.5 text-xs text-white disabled:opacity-50"
                    >
                      <option value="OWNER">OWNER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                    <div className="mt-2 flex justify-end gap-3"><button disabled={saving || u.role === "OWNER"} onClick={() => accountAction({ action: "status", id: u.id, active: u.status !== "Active" })} className="text-blue-300 disabled:opacity-40">{u.status === "Active" ? "Deactivate" : "Activate"}</button><button disabled={saving || u.role === "OWNER"} onClick={() => { if (confirm(`Delete account ${u.email}?`)) void accountAction({ action: "delete", id: u.id }); }} className="text-red-300 disabled:opacity-40">Delete</button></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
