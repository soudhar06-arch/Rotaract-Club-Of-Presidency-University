# SOFTWARE_ARCHITECTURE.md

## 1. Overall Architecture

The application follows a **modern full-stack architecture** with a clear separation between public-facing content and administrative functions.

`+-------------------------------------------------------------+
�                        Client Layer                         �
�  +---------------------+    +---------------------------+  �
�  �   Public Website    �    �    Admin Dashboard        �  �
�  �   (Next.js SSG/SSR) �    �   (Next.js SSR/CSR)       �  �
�  +---------------------+    +---------------------------+  �
+-------------+--------------------------+------------------+
              �                          �
              ?                          ?
+-------------------------------------------------------------+
�                      API Layer                              �
�  +--------------------------------------------------------+ �
�  �              Next.js API Routes / Server Actions       � �
�  �  - Auth handlers                                        � �
�  �  - CRUD operations                                      � �
�  �  - File upload handlers                                 � �
�  �  - AI chatbot endpoint                                  � �
�  +--------------------------------------------------------+ �
+-------------------------------------------------------------+
                                �
                                ?
+-------------------------------------------------------------+
�                    Data & Services Layer                    �
�  +--------------+  +--------------+  +------------------+  �
�  �  PostgreSQL   �  �   Supabase    �  �  AI / RAG        �  �
�  �  (Prisma ORM) �  �   Auth        �  �  (LangChain)     �  �
�  �               �  �   Storage     �  �                  �  �
�  +--------------+  +--------------+  +------------------+  �
+-------------------------------------------------------------+`

## 2. Technology Stack

### Frontend

| Component     | Technology               | Purpose                              |
| ------------- | ------------------------ | ------------------------------------ |
| Framework     | Next.js 14+ (App Router) | SSR, SSG, API routes, Server Actions |
| Language      | TypeScript               | Type safety                          |
| Styling       | Tailwind CSS             | Utility-first CSS                    |
| UI Components | shadcn/ui + Radix UI     | Accessible, customizable components  |
| Forms         | React Hook Form + Zod    | Form validation                      |
| Animations    | Framer Motion            | Page transitions, micro-interactions |
| Icons         | Lucide React             | Consistent icon set                  |

### Backend / Data

| Component      | Technology                | Purpose                           |
| -------------- | ------------------------- | --------------------------------- |
| Database       | PostgreSQL (via Supabase) | Primary data store                |
| ORM            | Prisma                    | Database access and migrations    |
| Authentication | Supabase Auth             | Email/password, magic link, OAuth |
| Storage        | Supabase Storage          | Image and document uploads        |
| File Upload    | React Dropzone            | Drag-and-drop uploads             |

### AI / Chatbot

| Component           | Technology                    | Purpose                           |
| ------------------- | ----------------------------- | --------------------------------- |
| LLM                 | OpenAI GPT-4o / GPT-4o-mini   | Chat completion                   |
| RAG Framework       | LangChain.js                  | Document processing and retrieval |
| Embeddings          | OpenAI text-embedding-3-small | Vector embeddings                 |
| Vector Store        | Supabase pgvector             | Semantic search                   |
| Document Processing | LangChain loaders             | PDF, DOCX, TXT parsing            |

### DevOps

| Component  | Technology                | Purpose               |
| ---------- | ------------------------- | --------------------- |
| Hosting    | Vercel                    | Frontend hosting      |
| Database   | Supabase Cloud            | Managed PostgreSQL    |
| CI/CD      | GitHub Actions / Vercel   | Automated deployments |
| Monitoring | Vercel Analytics + Sentry | Error tracking        |
| Email      | Resend / Supabase Email   | Transactional emails  |

## 3. System Design

### Design Patterns

- **Repository Pattern**: Data access abstracted behind repository interfaces.
- **Service Layer**: Business logic separated from controllers/routes.
- **Component Composition**: Reusable UI components via composition.
- **Server Actions**: Mutations handled via Next.js Server Actions where possible.
- **Optimistic UI**: Immediate feedback for user actions with rollback on error.

### Key Design Decisions

1. **Monorepo Structure**: Single repository for simplicity, with clear internal boundaries.
2. **Server-First Rendering**: Default to server components; client components only when interactivity is needed.
3. **Type Safety**: Strict TypeScript with Zod validation at boundaries.
4. **Convention over Configuration**: Standardized file naming and folder structure.

## 4. Folder Structure

`rotaract-website/
+-- prisma/
�   +-- schema.prisma          # Database schema
�   +-- migrations/            # Database migrations
+-- public/
�   +-- images/                # Static images
�   +-- fonts/                 # Custom fonts
�   +-- favicon.ico
+-- src/
�   +-- app/                   # Next.js App Router
�   �   +-- (public)/          # Public routes (no auth required)
�   �   �   +-- page.tsx       # Home
�   �   �   +-- about/
�   �   �   +-- events/
�   �   �   +-- gallery/
�   �   �   +-- awards/
�   �   �   +-- collaborations/
�   �   �   +-- contact/
�   �   �   +-- join/
�   �   +-- (admin)/           # Admin routes (auth required)
�   �   �   +-- dashboard/
�   �   �   +-- dashboard/events/
�   �   �   +-- dashboard/gallery/
�   �   �   +-- dashboard/bod/
�   �   �   +-- dashboard/awards/
�   �   �   +-- dashboard/collaborations/
�   �   �   +-- dashboard/applications/
�   �   �   +-- dashboard/knowledge-base/
�   �   �   +-- dashboard/settings/
�   �   +-- api/               # API routes
�   �   �   +-- auth/
�   �   �   +-- upload/
�   �   �   +-- chatbot/
�   �   +-- layout.tsx         # Root layout
�   �   +-- globals.css        # Global styles
�   +-- components/
�   �   +-- ui/                # Reusable UI components (shadcn)
�   �   +-- public/            # Public-facing components
�   �   �   +-- navbar.tsx
�   �   �   +-- footer.tsx
�   �   �   +-- hero.tsx
�   �   �   +-- event-card.tsx
�   �   �   +-- gallery-grid.tsx
�   �   �   +-- chatbot-widget.tsx
�   �   +-- admin/             # Admin-specific components
�   �       +-- sidebar.tsx
�   �       +-- data-table.tsx
�   �       +-- upload-zone.tsx
�   �       +-- rich-text-editor.tsx
�   +-- lib/
�   �   +-- db/                # Database utilities
�   �   �   +-- prisma.ts      # Prisma client singleton
�   �   �   +-- repositories/  # Data access layer
�   �   +-- auth/              # Auth utilities
�   �   �   +-- session.ts
�   �   �   +-- permissions.ts
�   �   +-- ai/                # AI / Chatbot
�   �   �   +-- rag.ts
�   �   �   +-- embeddings.ts
�   �   �   +-- prompt-templates.ts
�   �   +-- utils.ts           # Helper functions
�   �   +-- validators.ts      # Zod schemas
�   +-- hooks/                 # Custom React hooks
�   �   +-- use-media-query.ts
�   �   +-- use-debounce.ts
�   +-- types/                 # TypeScript type definitions
�   �   +-- database.ts
�   �   +-- api.ts
�   �   +-- components.ts
�   +-- middleware.ts          # Next.js middleware (auth guards)
+-- .env.local                 # Environment variables
+-- .env.example               # Example environment file
+-- tailwind.config.ts         # Tailwind configuration
+-- tsconfig.json              # TypeScript configuration
+-- next.config.js             # Next.js configuration
+-- package.json               # Dependencies
+-- README.md                  # Project README`

## 5. Component Hierarchy

`Layout (root)
+-- Navbar (public)
+-- Footer (public)
+-- AdminSidebar (admin only)
+-- ChatbotWidget (public)
+-- Page Content
    +-- HomePage
    �   +-- HeroSection
    �   +-- StatsSection
    �   +-- FeaturedEvents
    �   +-- CTASection
    +-- AboutPage
    �   +-- MissionVision
    �   +-- BODGrid
    +-- EventsPage
    �   +-- CalendarView
    �   +-- EventCard[]
    +-- GalleryPage
    �   +-- AlbumCard[]
    �   +-- LightboxModal
    +-- DashboardPage
    �   +-- StatCard[]
    �   +-- RecentActivity[]
    �   +-- QuickActions
    +-- ... (other pages)`

## 6. Routing Strategy

### Route Groups

- (public): Routes accessible without authentication.
- (admin): Routes protected by authentication middleware.

### Dynamic Routes

- /events/[slug] - Individual event pages
- /gallery/[slug] - Individual album pages
- /dashboard/events/[id] - Event edit page

### API Routes

- /api/auth/* - Authentication endpoints
- /api/upload/* - File upload endpoints
- /api/chatbot/* - Chatbot API proxy

## 7. State Management

### Server State

- **React Server Components (RSC)**: Default for data fetching.
- **Server Actions**: For mutations (create, update, delete).
- **React Query (TanStack Query)**: For client-side caching where needed (e.g., admin dashboard data tables).

### Client State

- **React useState/useReducer**: Local component state.
- **Zustand**: Global client state (e.g., chatbot open/closed, sidebar collapsed).
- **URL State**: Search params for filters, pagination, and navigation.

### Form State

- **React Hook Form**: Form state management with Zod validation.

## 8. Authentication

### Provider

- **Supabase Auth** integrated with Next.js middleware.

### Flow

1. User submits login form.
2. Supabase Auth validates credentials.
3. Session cookie is set via middleware.
4. Protected routes check session via middleware.
5. Role-based redirects and UI rendering.

### Session Management

- HttpOnly secure cookies.
- Token refresh handled automatically by Supabase.
- Middleware validates session on every request to protected routes.

### Authorization

- Role checks via permissions.ts utility.
- Server Components check auth via Supabase server client.
- Client Components use useSession hook.
- API routes verify JWT tokens.

## 9. Storage

### Supabase Storage Buckets

| Bucket         | Purpose               | Access                           |
| -------------- | --------------------- | -------------------------------- |
| event-images   | Event cover images    | Public read, authenticated write |
| gallery-images | Gallery photos        | Public read, authenticated write |
| od-avatars     | BOD profile photos    | Public read, authenticated write |
| ward-images    | Award photos          | Public read, authenticated write |
| partner-logos  | Collaboration logos   | Public read, authenticated write |
| knowledge-base | AI training documents | Admin only read/write            |

### Upload Strategy

- Client-side compression before upload.
- WebP conversion via Sharp (server-side).
- Unique filenames via UUID.
- Size limits enforced (10MB per file).

## 10. API Structure

### Public API Routes

- GET /api/events - List published events
- GET /api/events/[slug] - Get event details
- GET /api/gallery - List published albums
- GET /api/gallery/[slug] - Get album details
- POST /api/applications - Submit membership application
- POST /api/chatbot - Chatbot message endpoint

### Admin API Routes

- GET /api/admin/events - List all events (with drafts)
- POST /api/admin/events - Create event
- PUT /api/admin/events/[id] - Update event
- DELETE /api/admin/events/[id] - Delete event
- Similar CRUD for: gallery, bod, awards, collaborations, applications, knowledge-base

### Authentication Middleware

- Validates Supabase session.
- Checks user role against required role.
- Redirects to /login if unauthorized.

## 11. Deployment Strategy

### Environment

- **Development**: Local with .env.local
- **Staging**: Vercel Preview Deployments (on PR)
- **Production**: Vercel Production

### CI/CD Pipeline

1. Push to main triggers Vercel production deployment.
2. Pull requests trigger preview deployments.
3. Database migrations run via Prisma Migrate in CI.

### Environment Variables

`

# Supabase

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI

OPENAI_API_KEY=

# App

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SITE_NAME=
`

### Monitoring

- Vercel Analytics for performance.
- Sentry for error tracking.
- Supabase logs for database queries.
- Custom logging for chatbot interactions.
