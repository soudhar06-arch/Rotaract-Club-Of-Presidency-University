# PROJECT_SPEC.md

## 1. Vision

To build a modern, accessible, and feature-rich web platform for the Rotaract Club that serves as the central hub for members, prospective members, sponsors, and the community. The platform will streamline club operations, showcase impact, and foster engagement through an AI-powered knowledge base.

## 2. Goals

- **Primary Goal**: Create a professional public-facing website with an integrated admin dashboard.
- **Engagement**: Increase member participation and public visibility through dynamic content.
- **Automation**: Reduce administrative overhead via a self-service admin panel.
- **Knowledge**: Provide instant, AI-powered answers to common questions via a chatbot.
- **Scalability**: Build on a modern stack that can grow with the club's needs.

## 3. Features

### Public-Facing
- **Home / Hero**: Immersive landing with club mission, impact stats, and CTA.
- **About Us**: Club history, mission, vision, and Board of Directors (BOD) profiles.
- **Events**: Upcoming and past events with calendar view, registration, and details.
- **Gallery**: Photo albums from events with lightbox and categorization.
- **Awards & Recognition**: Showcase achievements and honors.
- **Collaborations**: Partner organizations and joint initiatives.
- **Contact / Join**: Membership inquiry form and contact information.
- **AI Chatbot**: Context-aware assistant powered by RAG for instant support.

### Admin Dashboard
- **Authentication & Authorization**: Secure login with role-based access (Admin, Super Admin, Editor).
- **Dashboard Overview**: Key metrics, recent activity, and quick actions.
- **Event Management**: CRUD for events with date, time, location, description, and images.
- **Gallery Management**: Upload, organize, and manage photo albums.
- **BOD Management**: Manage board member profiles, roles, and terms.
- **Awards Management**: Add and categorize awards and recognitions.
- **Collaboration Management**: Track partner organizations and agreements.
- **Application Management**: Review and process membership applications.
- **AI Knowledge Base**: Upload documents, manage chunks, and monitor chatbot usage.
- **Settings**: Site configuration, social links, and general preferences.

## 4. Functional Requirements

### FR-1: Authentication
- Users must authenticate via email/password or magic link.
- Role-based access control (RBAC) with at least three roles: Super Admin, Admin, Editor.
- Session persistence with configurable expiry.

### FR-2: Events
- Create, read, update, delete events.
- Events have: title, description, date, time, location, cover image, status (draft/published).
- Calendar view with month/week navigation.
- Event registration count tracking.

### FR-3: Gallery
- Upload images to albums.
- Albums have: title, description, cover image, event association.
- Image lightbox with navigation.
- Bulk upload support.

### FR-4: BOD Management
- Members have: name, role, bio, photo, email, term start/end, LinkedIn URL.
- Display order is configurable.

### FR-5: Awards
- Awards have: title, description, date, recipient, photo, category.
- Categories are predefined but extensible.

### FR-6: Collaborations
- Partners have: name, logo, description, website URL, partnership start date.
- Active/inactive status.

### FR-7: Applications
- Public form collects: name, email, phone, college/company, reason for joining.
- Admin can approve, reject, or request more info.
- Email notifications on status change.

### FR-8: AI Chatbot
- Floating widget on every page.
- Context-aware responses based on uploaded documents.
- Source citations for answers.
- Escalation to contact form for unresolved queries.

### FR-9: Content Management
- Rich text editor for descriptions.
- Image optimization and CDN delivery.
- SEO meta tags per page.

## 5. Non-functional Requirements

### NFR-1: Performance
- First Contentful Paint < 1.5s on 4G.
- Lighthouse Performance score > 90.
- Image lazy loading and WebP conversion.

### NFR-2: Security
- HTTPS enforced.
- SQL injection prevention via ORM.
- XSS protection via sanitization.
- Rate limiting on public APIs.
- Secure headers (CSP, HSTS).

### NFR-3: Accessibility
- WCAG 2.1 AA compliance.
- Keyboard navigation support.
- Screen reader compatibility.
- Alt text for all images.

### NFR-4: Reliability
- 99.9% uptime target.
- Automated daily backups.
- Error monitoring and alerting.

### NFR-5: Scalability
- Support for 10,000+ monthly visitors.
- Database connection pooling.
- CDN for static assets.

## 6. User Types

| Role | Description | Permissions |
|------|-------------|-------------|
| Super Admin | Full system access | All CRUD, user management, settings |
| Admin | Content manager | Events, Gallery, BOD, Awards, Applications CRUD |
| Editor | Content contributor | Events and Gallery CRUD only |
| Member | Registered user | View content, register for events |
| Public | Unauthenticated visitor | View public content, submit applications, use chatbot |

## 7. Website Structure

`
/
+-- Home (Hero, Stats, Featured Events, CTA)
+-- About (History, Mission, Vision, BOD)
+-- Events (Calendar, Upcoming, Past)
+-- Gallery (Albums, Lightbox)
+-- Awards (Categories, Recipients)
+-- Collaborations (Partners, Initiatives)
+-- Contact (Form, Social Links)
+-- Join (Membership Application)
+-- Admin Dashboard
    +-- Overview
    +-- Events
    +-- Gallery
    +-- BOD
    +-- Awards
    +-- Collaborations
    +-- Applications
    +-- AI Knowledge Base
    +-- Settings
`

## 8. Future Roadmap

- **Phase 2**: Member portal with login, event RSVP, and personalized dashboard.
- **Phase 3**: Payment integration for membership dues and event fees.
- **Phase 4**: Mobile app (React Native) with push notifications.
- **Phase 5**: Advanced analytics and member engagement tracking.
- **Phase 6**: Multi-club support with federation management.

## 9. Scope

### In Scope (MVP)
- Public website with all sections listed above.
- Admin dashboard with full content management.
- AI chatbot with basic RAG.
- PostgreSQL database with complete schema.
- Deployment to production with CI/CD.

### Out of Scope (Post-MVP)
- Member authentication and portal
- Payment processing
- Mobile application
- Multi-language support
- Advanced analytics

## 10. Constraints

- Must use Next.js (App Router) as the framework.
- Must use PostgreSQL via Supabase for database and auth.
- Must use Tailwind CSS for styling.
- Must be deployable to Vercel or similar static-friendly platform.
- Budget constraint: Free tier of all services where possible.
- Timeline constraint: MVP within 10 days.
- Single developer constraint: Code must be maintainable by future student developers.
