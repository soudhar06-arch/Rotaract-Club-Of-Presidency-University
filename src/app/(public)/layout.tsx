import Link from "next/link";
import { Menu } from "lucide-react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border/80 border-b bg-white/80 backdrop-blur dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Rotaract Club
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <Link href="/about">About</Link>
            <Link href="/events">Events</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/awards">Awards</Link>
            <Link href="/collaborations">Collaborations</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/join">Join</Link>
          </nav>
          <button
            className="border-border rounded-full border p-2 md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>
      <div>{children}</div>
      <footer className="border-border/80 border-t bg-white/70 px-6 py-8 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 Rotaract Club. All rights reserved.</p>
          <p>Public website scaffold for future feature implementation.</p>
        </div>
      </footer>
    </div>
  );
}
