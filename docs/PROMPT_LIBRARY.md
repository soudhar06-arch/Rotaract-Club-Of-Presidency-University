# PROMPT_LIBRARY.md

> **Note**: These prompts assume the AI has already read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, UI_DESIGN_SYSTEM.md, and ROADMAP.md.

---

## Navbar

`
Build a responsive navbar component for the Rotaract Club website.

Requirements:

- Fixed top position with backdrop blur
- Logo on the left (use a placeholder SVG or text logo)
- Desktop: horizontal links (Home, About, Events, Gallery, Awards, Collaborations, Contact, Join)
- Mobile: hamburger menu that opens a slide-in drawer
- Active link highlighting based on current route
- Smooth scroll to sections if single-page, or Next.js Link for multi-page
- Use Lucide React icons
- Follow UI_DESIGN_SYSTEM.md for colors, typography, and spacing
- Use Tailwind CSS classes

Place the component in src/components/public/navbar.tsx
`

---

## Footer

`
Build a responsive footer component for the Rotaract Club website.

Requirements:

- 4-column grid on desktop, single column on mobile
- Column 1: Club name, brief description, logo
- Column 2: Quick Links (Home, About, Events, Gallery, etc.)
- Column 3: Contact Info (email, phone, address)
- Column 4: Social Media Links (use Lucide icons: Instagram, Facebook, Twitter, LinkedIn)
- Bottom bar: Copyright notice and Built with love for Rotaract
- Background: Rotaract Blue (#003F87) with white text
- Follow UI_DESIGN_SYSTEM.md for spacing and typography
- Use Tailwind CSS classes

Place the component in src/components/public/footer.tsx
`

---

## Hero

`
Build a hero section component for the Rotaract Club homepage.

Requirements:

- Full viewport height (min-h-screen)
- Background image with dark overlay (use a placeholder from Unsplash or gradient)
- Centered content with club name, tagline, and two CTAs
- Primary CTA: Join Us linking to /join
- Secondary CTA: Explore Events linking to /events
- Subtle scroll indicator at bottom
- Fade-in animation on load
- Text color: White
- Follow UI_DESIGN_SYSTEM.md for typography (text-5xl heading, text-lg subtext)
- Use Tailwind CSS and Framer Motion for animations

Place the component in src/components/public/hero.tsx
`

---

## Events

`
Build the Events section with public listing, detail page, and admin CRUD.

Requirements:

1. Public Events Page (/events):
   - Grid of EventCard components
   - Filter tabs: Upcoming, Past, All
   - Each card shows: cover image, date badge, title, location, short description
   - Click navigates to /events/[slug]

2. Event Detail Page (/events/[slug]):
   - Full-width cover image
   - Event title, date/time, location
   - Full description (rich text)
   - Back button

3. Admin Events Page (/dashboard/events):
   - Data table with: Title, Date, Location, Status, Actions
   - Filter by status (All, Draft, Published, Archived)
   - Search by title
   - Create button opens EventForm in modal or new page
   - Pagination (10 per page)

4. Event Form:
   - Fields: Title, Description (rich text editor), Date, Time, Location, Cover Image, Status
   - Cover image: drag-and-drop upload with preview
   - Slug auto-generated from title
   - Save as Draft / Publish buttons

Follow UI_DESIGN_SYSTEM.md for all styling. Use Prisma for database access.
Create components in src/components/public/ and src/components/admin/.
`

---

## Gallery

`
Build the Gallery section with public albums, lightbox, and admin management.

Requirements:

1. Public Gallery Page (/gallery):
   - Grid of album cards showing cover image and title
   - Filter by published/unpublished (admin only sees all)
   - Click album navigates to /gallery/[slug]

2. Album Detail Page (/gallery/[slug]):
   - Masonry or grid layout of images
   - Click image opens LightboxModal
   - Lightbox: large image, prev/next navigation, close button, caption

3. Admin Gallery Page (/dashboard/gallery):
   - Grid of album cards with edit/delete actions
   - Create Album button
   - Bulk actions for images within album

4. Album Form:
   - Fields: Title, Description, Cover Image, Event Association (dropdown), Published toggle
   - Image upload: drag-and-drop multiple files
   - Image reordering via drag-and-drop

5. Lightbox Modal:
   - Full-screen overlay
   - Image centered with max-width constraint
   - Keyboard navigation (Escape to close, arrows to navigate)
   - Swipe support on mobile

Follow UI_DESIGN_SYSTEM.md for styling. Use Prisma for database access.
Create components in src/components/public/ and src/components/admin/.
`

---

## Awards

`
Build the Awards section with public display and admin management.

Requirements:

1. Public Awards Page (/awards):
   - Filter tabs by category
   - Grid of award cards
   - Each card shows: photo, title, recipient, date, category badge
   - Click to expand description

2. Admin Awards Page (/dashboard/awards):
   - Data table with: Title, Category, Recipient, Date, Actions
   - Create/Edit form with: Title, Description, Date, Recipient, Category (dropdown + custom), Photo
   - Category management: predefined categories + add new

Follow UI_DESIGN_SYSTEM.md for styling. Use Prisma for database access.
Create components in src/components/public/award-card.tsx and admin forms.
`

---

## Authentication

`
Implement Supabase authentication for the admin dashboard.

Requirements:

1. Login Page (/dashboard/login):
   - Email and password fields
   - Sign In button
   - Forgot password link (optional for MVP)
   - Error message display
   - Redirect to /dashboard on success

2. Middleware (middleware.ts):
   - Protect all /dashboard/* routes
   - Redirect unauthenticated users to /dashboard/login
   - Check user role for specific admin sections
   - Allow public routes (/, /events, /gallery, etc.) without auth

3. Auth Utilities (src/lib/auth/):
   - session.ts: Server-side session management using Supabase server client
   - permissions.ts: Role checking utilities (hasRole, canAccess)
   - useSession hook for client components

4. Logout:
   - Button in admin navbar
   - Clears session and redirects to login

Follow SOFTWARE_ARCHITECTURE.md for auth flow and middleware setup.
Use Supabase Auth with email/password provider.
`

---

## Supabase

`
Configure Supabase as the backend service.

Requirements:

1. Project Setup:
   - Create Supabase project
   - Enable email authentication
   - Create storage buckets: event-images, gallery-images, bod-avatars, award-images, partner-logos, knowledge-base
   - Set up Row Level Security (RLS) policies for storage buckets

2. Client Configuration:
   - Create src/lib/supabase/client.ts (browser client)
   - Create src/lib/supabase/server.ts (server client)
   - Create src/lib/supabase/middleware.ts (cookie-based session)

3. Database:
   - Initialize Prisma with Supabase connection string
   - Run migrations from DATABASE_SCHEMA.md
   - Enable pgvector extension in Supabase SQL editor

4. Environment Variables:
   - Document all required variables in .env.example
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

Follow SOFTWARE_ARCHITECTURE.md for project structure and tech stack.
`

---

## Dashboard

`
Build the admin dashboard overview page.

Requirements:

1. Stats Cards (4 cards in a row):
   - Total Events (count)
   - Total Albums (count)
   - Pending Applications (count with badge)
   - Knowledge Base Documents (count)

2. Recent Activity (table or list):
   - Last 5 events created
   - Last 5 applications submitted
   - Timestamps and user names

3. Quick Actions:
   - Create Event button
   - Upload Document button
   - Review Applications button

4. Charts (optional for MVP):
   - Events per month (bar chart using Recharts)
   - Application trends (line chart)

Follow UI_DESIGN_SYSTEM.md for card and table styling.
Use Prisma to fetch stats from database.
Place the page at src/app/(admin)/dashboard/page.tsx
`

---

## Calendar

`
Build a calendar view for events.

Requirements:

1. Monthly Calendar Component:
   - Grid of 7 columns (Sun-Sat)
   - Days of current month displayed
   - Navigation: Previous/Next month buttons
   - Today highlighting
   - Event indicators (dots or small bars) on dates with events

2. Event List Below Calendar:
   - List events for selected date
   - Show event title, time, location
   - Click to navigate to event detail

3. Admin Event Creation from Calendar:
   - Click empty date to open event creation form
   - Pre-fill date field

4. Implementation Options:
   - Use a library like react-big-calendar or build custom with CSS Grid
   - For MVP, a simple custom grid is sufficient

Follow UI_DESIGN_SYSTEM.md for styling.
Integrate with the Events CRUD from the Events prompt.
`

---

## AI Chatbot

`
Build the AI chatbot widget with RAG capabilities.

Requirements:

1. Chatbot Widget (floating on all public pages):
   - Toggle button (bottom-right corner)
   - Expandable chat window (300px wide, 400px tall)
   - Message list with user/assistant bubbles
   - Input field with send button
   - Close/minimize button

2. Chat API Route (/api/chatbot):
   - Accept POST with message and session_id
   - Embed query using OpenAI text-embedding-3-small
   - Search pgvector for top-3 similar chunks
   - Assemble context and system prompt
   - Call OpenAI GPT-4o-mini for response
   - Return response with source citations
   - Log interaction to ChatLog table

3. Admin Knowledge Base Page (/dashboard/knowledge-base):
   - Document list with status and chunk count
   - Upload button with drag-and-drop
   - Processing status indicator
   - Retry button for failed documents

4. Document Processing:
   - Extract text from PDF/DOCX/TXT using LangChain loaders
   - Split into 1000-char chunks with 200-char overlap
   - Embed using OpenAI API
   - Store in DocumentChunk table

Follow AI_CHATBOT.md for RAG architecture and prompt strategy.
Follow SOFTWARE_ARCHITECTURE.md for API route structure.
Use UI_DESIGN_SYSTEM.md for widget styling.
`

---

## Forms

`
Build reusable form components following the UI design system.

Requirements:

1. Input Component:
   - Label above input
   - Placeholder text
   - Error message below
   - Focus ring in Rotaract Blue
   - Disabled and read-only states

2. Textarea Component:
   - Same as input but with min-height
   - Resizable vertically only

3. Select Component:
   - Custom styled select with Lucide ChevronDown icon
   - Support for options and placeholders

4. File Upload Component:
   - Drag-and-drop zone
   - File type validation
   - Preview for images
   - Progress bar for upload
   - Remove file button

5. Rich Text Editor (for admin forms):
   - Use TipTap or similar
   - Toolbar: Bold, Italic, Underline, Lists, Link
   - Output: HTML or Markdown

6. Form Validation:
   - Use Zod schemas
   - Inline error messages
   - Submit button disabled during submission

Follow UI_DESIGN_SYSTEM.md for form styling rules.
Create components in src/components/ui/.
`

---

## Deployment

`
Deploy the Rotaract website to production.

Requirements:

1. Vercel Setup:
   - Connect GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Set up preview deployments for PRs

2. Supabase Production:
   - Create production Supabase project
   - Run all Prisma migrations
   - Enable pgvector extension
   - Create storage buckets with RLS policies
   - Seed initial admin user

3. Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - NEXT_PUBLIC_APP_URL

4. CI/CD:
   - Automatic deployment on push to main
   - Database migrations run in CI
   - Preview deployments for PRs

5. Post-Deployment:
   - Verify all pages load
   - Test authentication
   - Test file uploads
   - Test chatbot
   - Configure custom domain and SSL

Follow HANDOVER_GUIDE.md for deployment steps and maintenance procedures.
`
