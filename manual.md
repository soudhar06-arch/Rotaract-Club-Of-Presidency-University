# Rotaract Club Platform - Official Committee Handover Manual

Welcome to the official administration and maintenance manual for the **Rotaract Club of Presidency University** web platform. This guide is specifically written for incoming Rotaract committee members, web directors, and administrators to seamlessly operate, update, and deploy the website without requiring deep web development expertise.

---

## 1. PROJECT OVERVIEW

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19 App Router framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safe JavaScript)
- **Styling**: Vanilla CSS, Design Tokens (`src/styles/tokens.css`), TailwindCSS-compatible CSS variables, Framer Motion animations
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **Live Event CMS**: Google Calendar API v3
- **Database / Backend (Optional)**: Supabase (PostgreSQL / Storage)

### Primary Folder Structure

```
c:\Users\soudh\rotaract-website\
├── public/                     # Public static assets (images, logos, icons)
│   ├── gallery/                # Photo gallery & event preview images
│   ├── logos/                  # Official club & Rotary emblem SVGs
│   └── images/                 # Board photos, project assets, backgrounds
├── src/                        # Source code
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (public)/           # Public visitor pages (Home, About, Board, Events, Calendar, Gallery, Join)
│   │   ├── api/                # API routes (Chatbot, calendar hooks)
│   │   └── layout.tsx          # Root platform layout
│   ├── components/             # Reusable React UI components
│   │   ├── calendar/           # Interactive Google Calendar component
│   │   ├── layout/             # Footer component
│   │   ├── navigation/         # Header & Navbar navigation
│   │   ├── sections/           # Homepage & page content sections
│   │   └── shared/             # AI Assistant, Backgrounds, CountUp
│   ├── config/                 # Platform configuration & social links
│   ├── constants/              # Navigation routes & global constants
│   ├── hooks/                  # Custom React hooks (useCalendarEvents)
│   ├── lib/                    # Core libraries (google-calendar.ts, supabase.ts)
│   ├── services/               # Mock data & API service proxies
│   └── styles/                 # Global styles & design system tokens
├── .env.local                  # Private environment variables (API Keys)
├── manual.md                   # Handover manual (THIS FILE)
└── package.json                # Project dependencies & scripts
```

### Git Workflow & Deployment Strategy

- **Version Control**: GitHub (`main` branch)
- **Deployment Platform**: Vercel
- **Automatic Deployment**: Any push or pull request merge into the `main` branch automatically triggers a production build on Vercel.

---

## 2. HOW TO RUN THE PROJECT

### Step 1: Install Dependencies

Open your terminal in the project directory (`c:\Users\soudh\rotaract-website`) and run:

```bash
npm install
```

### Step 2: Start Development Server

To preview the website locally on your computer:

```bash
npm run dev
```

Open your browser and navigate to: `http://localhost:3000`

### Step 3: Run ESLint Quality Check

Before pushing code updates to GitHub, verify code quality by running:

```bash
npm run lint
```

### Step 4: Build for Production

To test the production build locally:

```bash
npm run build
```

---

## 3. HOW TO DEPLOY

### GitHub + Vercel Workflow

1. **GitHub Repository**: [Rotaract Website Repository](https://github.com/soudhar06-arch/rotaract2)
2. **Vercel Integration**:
   - Log in to your team's [Vercel Dashboard](https://vercel.com).
   - Select the **rotaract-website** project.
   - Click **Settings** → **Environment Variables** to manage production keys.
3. Every commit pushed to the `main` branch automatically updates the live website within 1–2 minutes.

---

## 4. WHERE TO EDIT WEBSITE CONTENT

Below is the complete reference table mapping website content to exact file paths.

| Content Area                           | Exact File Path                                                      | What to Edit                                             |
| :------------------------------------- | :------------------------------------------------------------------- | :------------------------------------------------------- |
| **Club Name & Site Meta**              | `src/config/site.ts`                                                 | Official club name, description, charter info            |
| **Navigation Items**                   | `src/components/navigation/navbar.tsx`                               | Menu labels, section IDs, links                          |
| **Hero Section (Title & Subtitle)**    | `src/components/sections/hero.tsx`                                   | Headline text, badge text, CTA buttons                   |
| **About Section & Mission/Vision**     | `src/components/sections/mission-vision.tsx`                         | Mission statement, vision text, core values              |
| **President & Secretary Messages**     | `src/app/(public)/about/page.tsx`                                    | Presidential message, leadership quotes                  |
| **Board of Directors**                 | `src/services/mock-data.ts`                                          | Names, roles, photo URLs, LinkedIn, Instagram            |
| **Faculty Coordinator & Mentors**      | `src/app/(public)/board/page.tsx`                                    | Faculty advisory board details                           |
| **Projects & Flagship Initiatives**    | `src/services/mock-data.ts`                                          | Project titles, descriptions, categories, images         |
| **Gallery Photos**                     | `src/services/mock-data.ts` & `public/gallery/`                      | Photo titles, categories, image file paths               |
| **Impact Statistics**                  | `src/components/sections/impact-stats.tsx`                           | Member count, hours served, funds raised, lives impacted |
| **Sponsors & Rotary Partners**         | `src/components/sections/credibility-strip.tsx`                      | Rotary District 3191 & corporate partner logos           |
| **Testimonials**                       | `src/services/mock-data.ts`                                          | Quotes, author names, titles                             |
| **Contact Info (Email, Phone, Venue)** | `src/config/site.ts` & `src/components/sections/contact-section.tsx` | Phone numbers, email, campus address                     |
| **Footer & Copyright**                 | `src/components/layout/footer.tsx`                                   | Quick links, social links, footer credit                 |

---

## 5. BOARD OF DIRECTORS MANAGEMENT

To update the Board of Directors for a new rotary year (e.g. 2026–2027), edit:
**`c:\Users\soudh\rotaract-website\src\services\mock-data.ts`**

### Example Board Member Object:

```ts
export const MOCK_BOARD: BoardMember[] = [
  {
    id: "board-1",
    name: "Rtr. Soudhar J",
    role: "President",
    department: "Executive Committee",
    image: "/images/board-president.jpeg", // Place photo in public/images/
    bio: "Leading District 3191 youth initiatives & university community service.",
    linkedin: "https://linkedin.com/in/soudhar",
    instagram: "https://instagram.com/rotaract_pu",
  },
  // Add additional board members here...
];
```

### Steps to Change Board Photos:

1. Save the new profile photo inside **`public/images/`** (e.g. `public/images/bod-president-2026.jpeg`).
2. Update the `image` field in `MOCK_BOARD` to `"/images/bod-president-2026.jpeg"`.

---

## 6. SOCIAL MEDIA CONFIGURATION

Social media URLs are globally managed in:
**`c:\Users\soudh\rotaract-website\src\config\site.ts`**

```ts
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/rotaract_presidency",
  facebook: "https://facebook.com/rotaractpresidency",
  linkedin: "https://linkedin.com/company/rotaract-presidency-university",
  twitter: "https://x.com/rotaract_pu",
  youtube: "https://youtube.com/@rotaractpresidency",
  discord: "https://discord.gg/rotaract-pu",
  whatsapp: "https://chat.whatsapp.com/your-invite-code",
  email: "rotaract@presidencyuniversity.in",
  website: "https://rotaractpu.org",
};
```

---

## 7. IMAGE PATHS & STORAGE DIRECTORY

Place all new media assets inside subdirectories under `public/`:

| Asset Category              | Directory Path    | Example File Name                                   |
| :-------------------------- | :---------------- | :-------------------------------------------------- |
| **Hero Backgrounds**        | `public/gallery/` | `gallery-1.jpeg`, `gallery-2.jpg`                   |
| **Event Preview Images**    | `public/gallery/` | `gallery-1.jpeg` _(Default: `DEFAULT_EVENT_IMAGE`)_ |
| **Gallery Photos**          | `public/gallery/` | `gallery-10.jpeg`                                   |
| **Board Photos**            | `public/images/`  | `bod-president.jpeg`                                |
| **Project Banner Assets**   | `public/images/`  | `project-blood-drive.png`                           |
| **Sponsor & Partner Logos** | `public/logos/`   | `rotary-3191.svg`                                   |
| **Club Emblem / Logo**      | `public/logos/`   | `club_logo.svg`                                     |

---

## 8. GOOGLE CALENDAR CMS INTEGRATION

The platform uses Google Calendar as the **single source of truth** for all events, conclaves, assemblies, and horizontal timeline milestones.

### Calendar ID

`eeb75d6bf01f26062e450bd636e8754def7c93a45bba4f7be07a862e49db8745@group.calendar.google.com`

### How to Create an Event

1. Open [Google Calendar](https://calendar.google.com/).
2. Select the **Rotaract Club of Presidency University** calendar on the left panel.
3. Click **+ Create** → **Event**.
4. Set Title, Date, Start & End Time, Location (Venue), and Description.

### Adding Custom Event Preview Images & Registration Links

In the Google Calendar Event Description box, you can use simple custom tags:

- **Custom Image Tag**: `[image: /gallery/gallery-2.jpg]` or `[image: https://your-domain.com/photo.jpg]`
- **Registration Link Tag**: `[registration: https://forms.gle/your-form-link]`
- **Category Tag**: `[category: Professional]` (Options: `Community`, `Professional`, `International`, `Cultural`, `Sports`)

### How Changes Sync to the Website

- Any event added, edited, moved, or deleted in Google Calendar is automatically fetched by the site via `fetchGoogleCalendarEventsWithDiagnostics()` in `src/lib/google-calendar.ts`.
- Revalidation occurs automatically every 30 seconds.

---

## 9. SUPABASE BACKEND (OPTIONAL)

If Supabase is enabled for online membership applications or collaboration forms:

### Configuration File

`src/lib/supabase.ts`

### Environment Keys

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 10. ENVIRONMENT VARIABLES REFERENCE

| Variable Name                    | Description                                     | Where to Obtain                                      |
| :------------------------------- | :---------------------------------------------- | :--------------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` | Public Google Calendar ID for events            | Google Calendar Settings → Integrate calendar        |
| `NEXT_PUBLIC_GOOGLE_API_KEY`     | Public Google Cloud API Key for Calendar API v3 | Google Cloud Console → APIs & Services → Credentials |
| `NEXT_PUBLIC_APP_URL`            | Base URL of the deployed platform               | Vercel domain (e.g. `https://rotaractpu.org`)        |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                            | Supabase Dashboard → Settings → API                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anonymous client key                   | Supabase Dashboard → Settings → API                  |

Store local variables in **`.env.local`** and production variables in **Vercel Project Settings**.

---

## 11. COMMITTEE HANDOVER CHECKLIST

Incoming committee members should complete the following checklist at the start of each rotary term:

- [ ] Obtain Vercel and GitHub administrator access from outgoing Web Director.
- [ ] Verify access to Google Calendar (`eeb75d6bf01f26062e450bd636e8754def7c93a45bba4f7be07a862e49db8745@group.calendar.google.com`).
- [ ] Update Board of Directors list in `src/services/mock-data.ts`.
- [ ] Upload new Board profile photos into `public/images/`.
- [ ] Update President and Secretary messages in `src/app/(public)/about/page.tsx`.
- [ ] Update social media URLs in `src/config/site.ts`.
- [ ] Update contact phone numbers and email in `src/config/site.ts`.
- [ ] Create upcoming semester events in Google Calendar.
- [ ] Run `npm run lint` and `npm run build` to confirm clean compilation.
