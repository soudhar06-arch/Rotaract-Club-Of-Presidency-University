"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState, useCallback } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { AuditLogItem } from "@/lib/cms-store";

export default function AuditAdminPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  const loadLogs = useCallback(() => {
    adminFetch("/api/admin?module=audit")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setLogs(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let ignore = false;
    adminFetch("/api/admin?module=audit")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setLogs(res.data);
        }
      })
      .catch(console.error);
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            Security & Governance
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            System Audit Trail
          </h1>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-base font-bold text-white">Mutation & Access Events</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">Total Entries: {logs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User / Operator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-medium">{log.entity}</td>
                  <td className="px-6 py-4 text-zinc-400">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
