"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Cloud,
  FileSpreadsheet,
  FolderGit2,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { AuditLogItem } from "@/lib/cms-store";
import { GoogleDiagnosticsReport, DiagnosticItem } from "@/lib/google-diagnostics";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    bodCount: number;
    projectsCount: number;
    usersCount: number;
    recentLogs: AuditLogItem[];
  } | null>(null);

  const [counters, setCounters] = useState<{ members: number | null; projects: number | null; bod: number | null }>({
    members: null,
    projects: null,
    bod: null,
  });

  const [googleReport, setGoogleReport] = useState<GoogleDiagnosticsReport | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(true);

  const loadDiagnostics = () => {
    setLoadingDiagnostics(true);
    adminFetch("/api/admin/google-status")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setGoogleReport(res.report);
      })
      .catch(console.error)
      .finally(() => setLoadingDiagnostics(false));
  };

  useEffect(() => {
    adminFetch("/api/admin?module=dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error);

    adminFetch("/api/counters")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCounters({
            members: res.data.members,
            projects: res.data.projects,
            bod: res.data.bod,
          });
        }
      })
      .catch(console.error);

    adminFetch("/api/admin/google-status")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setGoogleReport(res.report);
      })
      .catch(console.error)
      .finally(() => setLoadingDiagnostics(false));
  }, []);

  const renderStatusBadge = (item: DiagnosticItem) => {
    if (item.status === "CONNECTED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>CONNECTED</span>
        </span>
      );
    }
    if (item.status === "NOT_CONFIGURED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-zinc-500/10 text-zinc-400 border border-zinc-500/30 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>NOT CONFIG</span>
        </span>
      );
    }
    if (item.status === "PERMISSION_DENIED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>ACCESS DENIED</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        <span>{item.status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            Administrative Control Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            System Overview & CMS Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/bod"
            className="px-4 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            Manage BOD
          </Link>
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* Primary Live Impact Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Live Members</span>
            <Users className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {counters.members === null ? "?" : <CountUp end={counters.members} />}
          </div>
          <p className="text-[10px] text-zinc-500">Google Form Response Sync</p>
        </div>

        <div className="p-6 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Completed Projects</span>
            <Briefcase className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {counters.projects === null ? "?" : <CountUp end={counters.projects} />}
          </div>
          <p className="text-[10px] text-zinc-500">Documented Impact Drives</p>
        </div>

        <div className="p-6 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold">BOD Members</span>
            <Award className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {counters.bod === null ? "?" : <CountUp end={counters.bod} />}
          </div>
          <p className="text-[10px] text-zinc-500">Executive & Directors Roster</p>
        </div>

        <div className="p-6 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Admin Users</span>
            <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data ? <CountUp end={data.usersCount} /> : "?"}
          </div>
          <p className="text-[10px] text-zinc-500">Server-Side Protected Roles</p>
        </div>
      </div>

      {/* GOOGLE WORKSPACE CONNECTION DIAGNOSTICS PANEL */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono text-[#3B82F6] font-bold uppercase tracking-widest block">
              REAL-TIME CONNECTIONS
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#3B82F6]" />
              <span>Integration diagnostics</span>
            </h2>
          </div>

          <button
            onClick={loadDiagnostics}
            disabled={loadingDiagnostics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDiagnostics ? "animate-spin" : ""}`} />
            <span>Re-test Connections</span>
          </button>
        </div>

        {/* Service Account Email Info */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-zinc-400 font-mono uppercase block text-[10px]">Configured Service Account Email</span>
            <span className="font-mono font-bold text-white">
              {googleReport?.serviceAccountEmail || "Not set in GOOGLE_SERVICE_ACCOUNT_EMAIL"}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
              googleReport?.serviceAccountConfigured
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
            }`}
          >
            {googleReport?.serviceAccountConfigured ? "KEY LOADED" : "CONFIGURATION REQUIRED"}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Sheets Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
              <span>Google Sheets Sources</span>
            </h3>

            <div className="space-y-2">
              {googleReport?.sheets.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    {renderStatusBadge(item)}
                  </div>
                  <p className="text-[11px] text-zinc-400">{item.message}</p>
                  {item.actionableStep && item.status !== "CONNECTED" && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
                      👉 {item.actionableStep}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Google Drive Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
              <span>Google Drive Media Folders</span>
            </h3>

            <div className="space-y-2">
              {googleReport?.drive.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    {renderStatusBadge(item)}
                  </div>
                  <p className="text-[11px] text-zinc-400">{item.message}</p>
                  {item.actionableStep && item.status !== "CONNECTED" && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
                      👉 {item.actionableStep}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: System Status & Audit Trail */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0E121E]/80 p-6">
          <h3 className="text-base font-bold">Calendar, AI, database, storage & email</h3>
          {googleReport?.services.map(item => <div key={item.name} className="space-y-2 rounded-xl bg-white/5 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">{item.name}</span>{renderStatusBadge(item)}</div><p className="text-xs text-zinc-400">{item.message}</p></div>)}
        </div>

        {/* Recent Audit Trail Preview */}
        <div className="p-6 rounded-3xl border border-white/10 bg-[#0E121E]/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              Recent Audit Log
            </h3>
            <Link
              href="/admin/audit-log"
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentLogs && data.recentLogs.length > 0 ? (
              data.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-zinc-400 ml-2">{log.details}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-zinc-500">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
