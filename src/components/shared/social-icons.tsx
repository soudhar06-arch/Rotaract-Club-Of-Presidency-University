import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href="https://instagram.com/rotaract_pu"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-[#9A9A9A] transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
        aria-label="Instagram"
      >
        <InstagramIcon className="h-4 w-4" />
      </a>
      <a
        href="https://linkedin.com/company/rotaract-pu"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-[#9A9A9A] transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
        aria-label="LinkedIn"
      >
        <LinkedinIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
