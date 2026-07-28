import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  Brain,
  FileText,
  Handshake,
  Trophy,
  Users,
  Calendar,
  ImageIcon,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/dashboard/bod", label: "BOD", icon: Users },
  { href: "/dashboard/awards", label: "Awards", icon: Trophy },
  {
    href: "/dashboard/collaborations",
    label: "Collaborations",
    icon: Handshake,
  },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  {
    href: "/dashboard/knowledge-base",
    label: "AI Knowledge Base",
    icon: Brain,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-border w-full border-b bg-white/90 p-6 shadow-sm lg:w-72 lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Admin Panel
            </p>
            <h2 className="mt-2 text-xl font-semibold">Rotaract Dashboard</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
