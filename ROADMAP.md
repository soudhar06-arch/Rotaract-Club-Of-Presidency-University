# ROADMAP.md

## Milestone 1: Project Initialization and Setup
**Objective**: Set up the Next.js project, configure Tailwind, and initialize Supabase and Prisma.

**Estimated Time**: 2-3 hours
**Difficulty**: Easy

### Files to Create
- package.json
- 	sconfig.json
- 	ailwind.config.ts
- 
ext.config.js
- .env.example
- src/app/globals.css
- src/app/layout.tsx
- prisma/schema.prisma

### Components
- Root layout with font setup
- Basic page component

### Database Changes
- Initialize Prisma with Supabase connection
- Create initial migration

### Expected Result
- 
pm run dev starts successfully
- Tailwind styles applied
- Supabase client configured
- Database connection working

### Testing Checklist
- [ ] 
pm run dev runs without errors
- [ ] Tailwind classes render correctly
- [ ] Supabase client connects to database
- [ ] Prisma migrations apply successfully

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md and SOFTWARE_ARCHITECTURE.md. Initialize a Next.js 14 project with TypeScript and Tailwind CSS. Configure the project structure according to the folder structure in SOFTWARE_ARCHITECTURE.md. Set up Prisma with Supabase PostgreSQL. Create the initial database schema with the User table. Create .env.example with Supabase and OpenAI variables. Ensure npm run dev starts successfully on port 3000.
`

---

## Milestone 2: Authentication and Admin Layout
**Objective**: Implement Supabase authentication and the admin dashboard layout with protected routes.

**Estimated Time**: 2-3 hours
**Difficulty**: Medium

### Files to Create
- src/middleware.ts
- src/app/(admin)/layout.tsx
- src/components/admin/sidebar.tsx
- src/app/(admin)/dashboard/page.tsx
- src/app/(admin)/login/page.tsx
- src/lib/auth/session.ts
- src/lib/auth/permissions.ts

### Components
- AdminSidebar
- AdminLayout
- LoginPage
- DashboardOverview

### Database Changes
- None (using Supabase Auth)

### Expected Result
- Admin can log in with email/password
- Protected routes redirect to login
- Sidebar navigation renders
- Dashboard shows overview stats

### Testing Checklist
- [ ] Login with valid credentials works
- [ ] Invalid credentials show error
- [ ] Protected routes redirect unauthenticated users
- [ ] Sidebar highlights active route
- [ ] Logout clears session

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, and DATABASE_SCHEMA.md. Implement Supabase authentication for the admin dashboard. Create a login page at /dashboard/login. Create middleware to protect all /dashboard/* routes. Create an admin layout with a sidebar navigation. Create a dashboard overview page with stats cards (total events, total albums, pending applications). Use the role-based permissions defined in DATABASE_SCHEMA.md.
`

---

## Milestone 3: Public Layout and Homepage
**Objective**: Build the public-facing navbar, footer, and homepage with hero section.

**Estimated Time**: 2-3 hours
**Difficulty**: Easy

### Files to Create
- src/app/(public)/layout.tsx
- src/components/public/navbar.tsx
- src/components/public/footer.tsx
- src/components/public/hero.tsx
- src/app/(public)/page.tsx

### Components
- Navbar (with mobile hamburger menu)
- Footer
- HeroSection
- StatsSection
- CTASection

### Database Changes
- None

### Expected Result
- Public homepage renders with all sections
- Navbar links to all public pages
- Mobile responsive with hamburger menu
- Footer with social links and copyright

### Testing Checklist
- [ ] Homepage loads with hero, stats, and CTA
- [ ] Navbar links work correctly
- [ ] Mobile menu opens and closes
- [ ] Footer displays correctly
- [ ] All text is readable and well-spaced

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, and UI_DESIGN_SYSTEM.md. Build the public website layout with a responsive navbar and footer. Create the homepage with a hero section, stats section, and CTA section. Use the color palette, typography, and spacing rules from UI_DESIGN_SYSTEM.md. Ensure the navbar collapses to a hamburger menu on mobile. Use Lucide React icons for the navbar and footer.
`

---

## Milestone 4: Events Management (Public + Admin)
**Objective**: Build the events section with public listing and admin CRUD.

**Estimated Time**: 2-3 hours
**Difficulty**: Medium

### Files to Create
- src/app/(public)/events/page.tsx
- src/app/(public)/events/[slug]/page.tsx
- src/app/(admin)/dashboard/events/page.tsx
- src/app/(admin)/dashboard/events/[id]/page.tsx
- src/components/public/event-card.tsx
- src/components/admin/event-form.tsx
- src/lib/db/repositories/event.repository.ts

### Components
- EventCard
- EventForm
- EventCalendar (basic)
- EventList

### Database Changes
- Event table already defined in Milestone 1

### Expected Result
- Public events page lists published events
- Event detail page shows full information
- Admin can create, edit, and delete events
- Events can be saved as draft or published

### Testing Checklist
- [ ] Public events page shows published events only
- [ ] Event detail page renders correctly
- [ ] Admin can create a new event
- [ ] Admin can edit an existing event
- [ ] Admin can delete an event
- [ ] Draft events are not visible publicly

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and UI_DESIGN_SYSTEM.md. Build the Events section. Create a public events listing page at /events showing published events in a grid of EventCard components. Create an event detail page at /events/[slug]. Create an admin events page at /dashboard/events with a data table for CRUD operations. Create an event form with fields for title, description, date, time, location, cover image, and status. Use the UI design system for styling.
`

---

## Milestone 5: Gallery Management
**Objective**: Build the gallery section with albums and lightbox, plus admin management.

**Estimated Time**: 2-3 hours
**Difficulty**: Medium

### Files to Create
- src/app/(public)/gallery/page.tsx
- src/app/(public)/gallery/[slug]/page.tsx
- src/app/(admin)/dashboard/gallery/page.tsx
- src/app/(admin)/dashboard/gallery/[id]/page.tsx
- src/components/public/gallery-grid.tsx
- src/components/public/lightbox-modal.tsx
- src/components/admin/album-form.tsx
- src/lib/db/repositories/gallery.repository.ts

### Components
- GalleryGrid
- LightboxModal
- AlbumForm
- AlbumCard

### Database Changes
- Album, GalleryImage tables already defined

### Expected Result
- Public gallery page shows published albums
- Clicking an album opens the lightbox
- Admin can create albums and upload images
- Images can be reordered

### Testing Checklist
- [ ] Gallery page displays album grid
- [ ] Album page shows images
- [ ] Lightbox opens and navigates between images
- [ ] Admin can create a new album
- [ ] Admin can upload multiple images
- [ ] Image sort order works correctly

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and UI_DESIGN_SYSTEM.md. Build the Gallery section. Create a public gallery page at /gallery showing published albums. Create an album detail page at /gallery/[slug] with a lightbox modal for image viewing. Create an admin gallery page at /dashboard/gallery with CRUD for albums and images. Implement drag-and-drop image upload with preview. Use the UI design system for consistent styling.
`

---

## Milestone 6: About Page and BOD Management
**Objective**: Build the About page with BOD profiles and admin management.

**Estimated Time**: 2-3 hours
**Difficulty**: Easy

### Files to Create
- src/app/(public)/about/page.tsx
- src/app/(admin)/dashboard/bod/page.tsx
- src/app/(admin)/dashboard/bod/[id]/page.tsx
- src/components/public/bod-grid.tsx
- src/components/admin/bod-form.tsx
- src/lib/db/repositories/bod.repository.ts

### Components
- BODGrid
- BODCard
- BODForm

### Database Changes
- BoardMember, BoardMemberPhoto tables already defined

### Expected Result
- About page shows mission, vision, and BOD grid
- BOD profiles display with photo, role, and bio
- Admin can manage BOD members
- Active members sorted by display order

### Testing Checklist
- [ ] About page renders correctly
- [ ] BOD grid shows active members
- [ ] BOD cards display photo and info
- [ ] Admin can add a new BOD member
- [ ] Admin can edit and delete members
- [ ] Sort order affects display order

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and UI_DESIGN_SYSTEM.md. Build the About page at /about with mission, vision, and Board of Directors section. Create a BOD grid component showing active members with photos, names, roles, and bios. Create an admin BOD management page at /dashboard/bod with CRUD operations. Use the UI design system for card and form styling.
`

---

## Milestone 7: Awards, Collaborations, and Applications
**Objective**: Build awards, collaborations, and membership application sections.

**Estimated Time**: 2-3 hours
**Difficulty**: Medium

### Files to Create
- src/app/(public)/awards/page.tsx
- src/app/(public)/collaborations/page.tsx
- src/app/(public)/join/page.tsx
- src/app/(admin)/dashboard/awards/page.tsx
- src/app/(admin)/dashboard/collaborations/page.tsx
- src/app/(admin)/dashboard/applications/page.tsx
- src/components/public/award-card.tsx
- src/components/public/collaboration-card.tsx
- src/components/public/application-form.tsx
- src/lib/db/repositories/awards.repository.ts
- src/lib/db/repositories/collaborations.repository.ts
- src/lib/db/repositories/applications.repository.ts

### Components
- AwardCard
- CollaborationCard
- ApplicationForm
- Admin forms for each

### Database Changes
- Award, Collaboration, Application tables already defined

### Expected Result
- Public awards page shows awards grid
- Public collaborations page shows partner logos
- Public join page has application form
- Admin can manage awards, collaborations, and review applications
- Application status changes trigger emails

### Testing Checklist
- [ ] Awards page displays correctly
- [ ] Collaborations page shows logos
- [ ] Application form submits successfully
- [ ] Admin can create/edit awards
- [ ] Admin can create/edit collaborations
- [ ] Admin can review and update application status
- [ ] Email notifications sent on status change

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and UI_DESIGN_SYSTEM.md. Build the Awards, Collaborations, and Join (Applications) sections. Create public pages at /awards, /collaborations, and /join. Create admin pages at /dashboard/awards, /dashboard/collaborations, and /dashboard/applications. The join page should have a form for membership applications. The applications admin page should allow approving, rejecting, and requesting info with email notifications. Use the UI design system for styling.
`

---

## Milestone 8: AI Chatbot with RAG
**Objective**: Implement the AI chatbot with retrieval-augmented generation.

**Estimated Time**: 3-4 hours
**Difficulty**: Hard

### Files to Create
- src/components/public/chatbot-widget.tsx
- src/app/api/chatbot/route.ts
- src/app/(admin)/dashboard/knowledge-base/page.tsx
- src/lib/ai/rag.ts
- src/lib/ai/embeddings.ts
- src/lib/ai/prompt-templates.ts
- src/app/(admin)/dashboard/knowledge-base/upload/page.tsx

### Components
- ChatbotWidget
- ChatMessage
- KnowledgeBaseList
- DocumentUpload

### Database Changes
- KnowledgeDocument, DocumentChunk, ChatLog tables already defined

### Expected Result
- Chatbot widget appears on all public pages
- Users can ask questions and get context-aware answers
- Admin can upload documents to the knowledge base
- Documents are processed into chunks and embeddings
- Answers include source citations

### Testing Checklist
- [ ] Chatbot widget opens and closes
- [ ] User can send messages
- [ ] Responses are relevant to uploaded documents
- [ ] Source citations are displayed
- [ ] Admin can upload a PDF document
- [ ] Document processing completes successfully
- [ ] Chatbot answers questions based on uploaded document

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and AI_CHATBOT.md. Build the AI chatbot feature. Create a floating chatbot widget on all public pages. Create an API route at /api/chatbot that implements RAG using LangChain.js, OpenAI embeddings, and Supabase pgvector. Create an admin knowledge base page at /dashboard/knowledge-base for uploading and managing documents. Documents should be processed into chunks with embeddings stored in the DocumentChunk table. Include source citations in chatbot responses.
`

---

## Milestone 9: Contact Page and Site Settings
**Objective**: Build the contact page and site settings management.

**Estimated Time**: 1-2 hours
**Difficulty**: Easy

### Files to Create
- src/app/(public)/contact/page.tsx
- src/app/(admin)/dashboard/settings/page.tsx
- src/components/public/contact-form.tsx
- src/components/admin/settings-form.tsx
- src/lib/db/repositories/settings.repository.ts

### Components
- ContactForm
- SettingsForm

### Database Changes
- SiteSettings table already defined

### Expected Result
- Contact page has a working form
- Admin can update site settings (name, social links, etc.)
- Settings persist in database

### Testing Checklist
- [ ] Contact form submits successfully
- [ ] Admin can update site settings
- [ ] Settings persist after page reload
- [ ] Site name appears in navbar and footer

### AI Prompt for Implementation
`
Read PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, DATABASE_SCHEMA.md, and UI_DESIGN_SYSTEM.md. Build the Contact page at /contact with a form for general inquiries. Create an admin settings page at /dashboard/settings for managing site configuration (site name, social links, contact email). Use the SiteSettings table for persistence. Use the UI design system for form styling.
`

---

## Milestone 10: Deployment and CI/CD
**Objective**: Deploy to production and set up CI/CD.

**Estimated Time**: 2-3 hours
**Difficulty**: Medium

### Files to Create
- .env.production
- .github/workflows/deploy.yml (optional)
- ercel.json
- scripts/deploy.sh or deploy instructions

### Components
- None

### Database Changes
- Run all migrations on production database

### Expected Result
- Site deployed to Vercel
- Environment variables configured
- Database migrated
- Custom domain configured (if applicable)

### Testing Checklist
- [ ] Production build succeeds
- [ ] All pages load correctly in production
- [ ] Authentication works in production
- [ ] File uploads work in production
- [ ] Chatbot functions in production
- [ ] SSL certificate active

### AI Prompt for Implementation
`
Read SOFTWARE_ARCHITECTURE.md and HANDOVER_GUIDE.md. Prepare the project for production deployment. Create a vercel.json configuration. Ensure all environment variables are documented. Create deployment instructions. Run Prisma migrations on the production database. Verify all features work in a production build. Document the deployment steps.
`
