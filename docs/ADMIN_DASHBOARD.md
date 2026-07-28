# ADMIN_DASHBOARD.md

## 1. Dashboard Layout

### Structure

`+--------------------------------------------------------------+
� Top Navbar (Admin)                                           �
+--------------------------------------------------------------�
� Sidebar  �  Main Content Area                                �
�          �                                                   �
� - Logo   �  +---------------------------------------------+ �
� - Nav    �  � Page Header (Title + Actions)              � �
� - Links  �  +---------------------------------------------� �
�          �  �                                             � �
� - User   �  �         Page Content                       � �
�          �  �                                             � �
�          �  �                                             � �
�          �  +---------------------------------------------+ �
+--------------------------------------------------------------+`

### Top Navbar

- **Height**: 64px (h-16)
- **Background**: White with bottom border (Gray-200)
- **Left**: Hamburger menu (mobile), Dashboard title (desktop)
- **Right**: Notifications bell, User avatar dropdown, Logout button

### Sidebar

- **Width**: 260px (desktop), 280px (expanded mobile drawer)
- **Background**: White or light Gray-50
- **Collapsed state**: Icons only (80px) on desktop (optional)
- **Sticky**: Yes, follows scroll within viewport

## 2. Sidebar Navigation

### Navigation Items

| Item              | Icon            | Path                      | Badge         |
| ----------------- | --------------- | ------------------------- | ------------- |
| Dashboard         | LayoutDashboard | /dashboard                | -             |
| Events            | Calendar        | /dashboard/events         | -             |
| Gallery           | Image           | /dashboard/gallery        | -             |
| BOD               | Users           | /dashboard/bod            | -             |
| Awards            | Trophy          | /dashboard/awards         | -             |
| Collaborations    | Handshake       | /dashboard/collaborations | -             |
| Applications      | FileText        | /dashboard/applications   | pending count |
| AI Knowledge Base | Brain           | /dashboard/knowledge-base | -             |
| Settings          | Settings        | /dashboard/settings       | -             |

### Active State

- Background: Rotaract Blue at 10% opacity
- Left border: 3px solid Rotaract Blue
- Text color: Rotaract Blue
- Icon color: Rotaract Blue

### Collapsed State (Desktop)

- Icons only, centered.
- Tooltip on hover showing item name.

## 3. Navigation Flow

### Sidebar Navigation

- Click item navigates to corresponding admin section.
- Active section highlighted.
- Mobile: Sidebar becomes a slide-in drawer toggled by hamburger.

### Breadcrumbs

- Shown below top navbar for nested routes.
- Format: Dashboard > Events > Edit
- Clickable parent segments.

## 4. Permissions

### Role Matrix

| Feature            | Super Admin | Admin | Editor |
| ------------------ | ----------- | ----- | ------ |
| Dashboard Overview | View        | View  | View   |
| Events             | CRUD        | CRUD  | CRUD   |
| Gallery            | CRUD        | CRUD  | CRUD   |
| BOD                | CRUD        | CRUD  | View   |
| Awards             | CRUD        | CRUD  | View   |
| Collaborations     | CRUD        | CRUD  | View   |
| Applications       | CRUD        | CRUD  | View   |
| AI Knowledge Base  | CRUD        | CRUD  | View   |
| Settings           | Edit        | View  | View   |
| User Management    | CRUD        | None  | None   |

### Permission Checks

- Implemented via middleware and server-side checks.
- UI hides/ disables actions based on permissions.
- API routes enforce permissions regardless of UI state.

## 5. User Roles

### Super Admin

- Full system access.
- Can create, edit, delete admin and editor accounts.
- Can change site settings.
- Can access all sections.

### Admin

- Full content management access.
- Cannot manage users or change settings.
- Can approve/reject applications.
- Can upload AI documents.

### Editor

- Limited to Events and Gallery.
- Can create and edit own content.
- Cannot publish content (requires Admin approval).
- Cannot delete content.

## 6. CRUD Flow

### General Pattern

1. **List Page**: Data table with search, filter, and pagination.
2. **Create/Edit Page**: Form with validation, image upload, and preview.
3. **Delete Action**: Confirmation dialog, soft delete preferred.
4. **Success/Error**: Toast notifications.

### Data Table Features

- Sortable columns (click header).
- Search across text fields.
- Filter by status, date range, category.
- Bulk actions (delete, publish) with checkbox selection.
- Row actions: Edit, Delete, View (context menu or icon buttons).
- Pagination: 10, 25, 50, 100 items per page.

### Form Features

- Auto-save draft (localStorage) for long forms.
- Image upload with drag-and-drop, preview, and crop.
- Rich text editor for descriptions.
- Date picker for event dates.
- Slug auto-generation from title.
- Validation feedback inline.

## 7. Event Management

### List View

- Table with columns: Title, Date, Location, Status, Actions.
- Filter by status (All, Draft, Published, Archived).
- Search by title or location.

### Create/Edit Form

- Fields: Title, Description (rich text), Date, Time, Location, Cover Image, Status.
- Cover image: Drag-and-drop upload with preview.
- Slug: Auto-generated, editable.
- Save as Draft / Publish toggle.

### Calendar View

- Monthly calendar grid.
- Events shown as colored dots or small cards on dates.
- Click date to add event.
- Click event to edit.

## 8. Gallery Management

### Album List

- Grid of album cards with cover image and title.
- Filter by published/unpublished.
- Search by title.

### Album Create/Edit

- Fields: Title, Description, Cover Image, Event Association, Published toggle.
- Image upload: Multiple files via drag-and-drop.
- Image ordering: Drag-and-drop sort within album.

### Image Management

- Lightbox to preview images.
- Edit caption, delete images.
- Set as cover image.

## 9. BOD Management

### Member List

- Table with: Name, Role, Term, Active status, Sort order.
- Active members sorted by sort_order.

### Member Create/Edit

- Fields: Name, Role, Bio, Email, LinkedIn URL, Photo, Term Start, Term End, Sort Order, Active.
- Photo upload with preview.
- Sort order: Number input, lower numbers appear first.

### Display

- Grid of profile cards on public About page.
- Click to expand bio and social links.

## 10. Awards Management

### Award List

- Table with: Title, Category, Recipient, Date, Actions.
- Filter by category.

### Award Create/Edit

- Fields: Title, Description, Date, Recipient, Category, Photo.
- Category: Dropdown with existing categories + custom input.
- Photo upload with preview.

### Display

- Grid of award cards on public Awards page.
- Filter by category.

## 11. Applications

### List View

- Table with: Name, Email, College/Company, Status, Date, Actions.
- Status badges: Pending (Yellow), Approved (Green), Rejected (Red), Info Requested (Blue).
- Filter by status.

### Review Flow

1. Click application to open detail view.
2. Read reason and details.
3. Choose action: Approve, Reject, Request Info.
4. Add review notes.
5. Save triggers email notification to applicant.

### Email Templates

- Approval: Congratulations, next steps.
- Rejection: polite decline, encouragement to reapply.
- Info Request: Specific questions, contact info.

## 12. Collaborations

### Partner List

- Table with: Name, Website, Active, Start Date, Actions.
- Filter by active/inactive.

### Partner Create/Edit

- Fields: Name, Description, Website URL, Logo, Partnership Start, Active.
- Logo upload with preview.

### Display

- Logo grid on public Collaborations page.
- Click to view details and visit website.

## 13. AI Knowledge Base

### Document List

- Table with: Title, Filename, Status, Chunks, Upload Date, Actions.
- Status: Processing (spinner), Ready (green check), Failed (red X).
- Retry button for failed documents.

### Upload Flow

1. Click Upload Document.
2. Drag-and-drop or browse for file (PDF, DOCX, TXT, MD).
3. Enter title and optional description.
4. Upload to Supabase Storage.
5. Trigger background processing (Server Action or API route).
6. Processing: Extract text, chunk, embed, store in pgvector.
7. Status updates to Ready when complete.

### Document Processing

- Chunk size: 1000 characters with 200 character overlap.
- Embedding model: text-embedding-3-small.
- Chunk storage: DocumentChunk table with embedding vector.

### Monitoring

- Total documents, total chunks.
- Processing queue status.
- Recent chatbot queries and source citations.
- Failed uploads with error logs.
