# Rotaract Club Platform

Official web platform and administrative dashboard for the **Rotaract Club of Presidency University**. Built for high performance, accessibility, community impact, and AI-powered knowledge retrieval.

---

## 1. Project Overview

The Rotaract Club Platform serves as the central digital hub for club members, prospective members, leadership, and university sponsors. It combines a public-facing editorial website with an administrative dashboard to manage events, photo galleries, Board of Directors profiles, awards, membership applications, and an AI chatbot assistant.

---

## 2. Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Design Token System (`docs/DESIGN_SYSTEM_MASTER.md`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Form Management & Validation**: React Hook Form + Zod
- **Date Handling**: `date-fns`
- **Theme Management**: `next-themes` (Dark/Light mode)
- **Database & Auth (Client Ready)**: Supabase (`@supabase/supabase-js`)
- **Quality & Pre-commit**: ESLint, Prettier, Husky, lint-staged

---

## 3. Folder Structure

```
rotaract-website/
├── public/
│   ├── images/          # Event photos, OG images, banners
│   ├── logos/           # Rotaract & Rotary official logos
│   ├── icons/           # SVG icons & favicon
│   ├── illustrations/   # Empty state vectors
│   └── fonts/           # Local font assets
├── src/
│   ├── app/             # App Router pages, layouts, error boundaries, loading UI
│   │   ├── (public)/    # Public route group
│   │   └── (admin)/     # Admin dashboard route group
│   ├── components/      # UI components by domain
│   │   ├── ui/          # Atomic primitives (Button, Card, Input)
│   │   ├── layout/      # Container shells, grid wrappers
│   │   ├── navigation/  # Navbar, sidebar, breadcrumbs
│   │   ├── sections/    # Hero, Mission, Impact, CTA sections
│   │   ├── forms/       # Contact, Join, Search forms
│   │   └── shared/      # Cross-cutting components
│   ├── config/          # Central site config & design tokens TS object
│   ├── constants/       # App constants, routes, token exports
│   ├── hooks/           # Custom React hooks (useMediaQuery, useDebounce, useMounted)
│   ├── lib/             # Utility functions (`cn`), validators (Zod), database client
│   ├── providers/       # ThemeProvider, MotionProvider, AppProviders root wrapper
│   ├── services/        # Service layer abstractions (Supabase, API callers)
│   ├── styles/          # `tokens.css`, `globals.css`
│   ├── types/           # TypeScript interfaces (Database, Theme, Props)
│   └── utils/           # Helper formatters (`formatDate`, `truncateText`)
├── docs/                # Architectural & design system documentation
├── .husky/              # Git pre-commit hooks
├── eslint.config.mjs    # ESLint configuration
├── .prettierrc.json     # Prettier configuration
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
└── package.json         # Package manifest & scripts
```

---

## 4. How to Run

### Prerequisites

- **Node.js**: `v18.17+` or `v20+`
- **npm**: `v9+` or `v10+`

### Installation

```bash
# Clone the repository
git clone https://github.com/soudhar06-arch/rotaract_presidency_university.git
cd rotaract-website

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Development Workflow

1. **Type Checking**: Run `npm run type-check` before committing changes to ensure 0 TypeScript errors.
2. **Linting**: Run `npm run lint` to enforce project code standards.
3. **Formatting**: Run `npm run format` or `npm run format:check` to check Prettier formatting.
4. **Building**: Run `npm run build` to verify production builds locally.

---

## 6. Git Workflow

- **Branching Strategy**:
  - `main` — Production branch.
  - `feature/<feature-name>` — Feature development branches.
  - `fix/<bug-name>` — Bugfix branches.
- **Pre-commit Hooks**: Husky automatically runs `lint-staged` on git commit to format and lint staged files.

---

## 7. Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 8. Deployment Plan

- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Setup**: Set `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings.
