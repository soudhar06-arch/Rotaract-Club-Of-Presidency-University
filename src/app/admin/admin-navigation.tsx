"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  MapPin,
  Share2,
  Settings,
  ShieldCheck,
  FileText,
  Menu,
  X,
  LogOut,
  Globe,
} from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Board of Directors", href: "/admin/bod", icon: Users },
  { label: "Projects Archive", href: "/admin/projects", icon: Briefcase },
  { label: "Avenues", href: "/admin/avenues", icon: Layers },
  { label: "Past Events", href: "/admin/events", icon: Calendar },
  { label: "Media & Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "FAQs", href: "/admin/faq", icon: HelpCircle },
  { label: "Contact & Address", href: "/admin/contact", icon: MapPin },
  { label: "Social Links", href: "/admin/social", icon: Share2 },
  { label: "User Management", href: "/admin/users", icon: ShieldCheck },
  { label: "Audit Log", href: "/admin/audit-log", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Skip sidebar layout for login route
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0C0F17]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#3B82F6] flex items-center justify-center font-bold text-white text-xs">
            RC
          </div>
          <span className="font-bold text-sm tracking-wide text-white uppercase">RCPU Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0C0F1E] border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-indigo-500 flex items-center justify-center font-extrabold text-white text-sm shadow-lg shadow-[#3B82F6]/30">
              RC
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white uppercase">RCPU CMS</h2>
              <span className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider block">
                District 3192
              </span>
            </div>
          </div>

          {/* User Role Badge */}
          <div className="p-3 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Rotaract Secretariat</div>
              <div className="text-[10px] text-zinc-400">rotaractcpu@gmail.com</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 uppercase">
              OWNER
            </span>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Public Website</span>
            <Globe className="w-4 h-4" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>{loggingOut ? "Logging out..." : "Sign Out"}</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
