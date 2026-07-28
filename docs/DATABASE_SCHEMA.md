# DATABASE_SCHEMA.md

## ER Diagram

`mermaid
erDiagram
User ||--o{ Event : creates/edits
User ||--o{ Application : reviews
User {
uuid id PK
string email
string name
string role
string avatar_url
timestamp created_at
}

    Event ||--o{ EventImage : has
    Event {
        uuid id PK
        string title
        text description
        date date
        time time
        string location
        string cover_image
        string status
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    EventImage {
        uuid id PK
        uuid event_id FK
        string url
        int sort_order
    }

    Album ||--o{ GalleryImage : contains
    Album {
        uuid id PK
        string title
        text description
        string cover_image
        uuid event_id FK
        boolean is_published
        uuid created_by FK
        timestamp created_at
    }

    GalleryImage {
        uuid id PK
        uuid album_id FK
        string url
        string caption
        int sort_order
    }

    BoardMember ||--o{ BoardMemberPhoto : has
    BoardMember {
        uuid id PK
        string name
        string role
        text bio
        string email
        string linkedin_url
        date term_start
        date term_end
        int sort_order
        boolean is_active
        timestamp created_at
    }

    BoardMemberPhoto {
        uuid id PK
        uuid member_id FK
        string url
    }

    Award ||--o{ AwardImage : has
    Award {
        uuid id PK
        string title
        text description
        date date
        string recipient
        string category
        uuid created_by FK
        timestamp created_at
    }

    AwardImage {
        uuid id PK
        uuid award_id FK
        string url
    }

    Collaboration ||--o{ CollaborationLogo : has
    Collaboration {
        uuid id PK
        string name
        text description
        string website_url
        string logo
        date partnership_start
        boolean is_active
        timestamp created_at
    }

    CollaborationLogo {
        uuid id PK
        uuid collaboration_id FK
        string url
    }

    Application {
        uuid id PK
        string name
        string email
        string phone
        string college_company
        text reason
        string status
        uuid reviewed_by FK
        text review_notes
        timestamp created_at
        timestamp reviewed_at
    }

    KnowledgeDocument ||--o{ DocumentChunk : contains
    KnowledgeDocument {
        uuid id PK
        string title
        string filename
        int file_size
        string status
        uuid uploaded_by FK
        int chunk_count
        timestamp created_at
        timestamp processed_at
    }

    DocumentChunk {
        uuid id PK
        uuid document_id FK
        text content
        vector embedding
        int chunk_index
        timestamp created_at
    }

    SiteSettings {
        uuid id PK
        string key
        text value
        timestamp updated_at
    }

    ChatLog {
        uuid id PK
        string session_id
        string message
        string role
        text sources
        timestamp created_at
    }

`

## Tables

### 1. User

Stores admin and member accounts.

| Column     | Type         | Nullable | Default           | Description                      |
| ---------- | ------------ | -------- | ----------------- | -------------------------------- |
| id         | uuid         | No       | gen_random_uuid() | Primary key                      |
| email      | varchar(255) | No       | -                 | Unique email address             |
| name       | varchar(255) | No       | -                 | Full name                        |
| role       | enum         | No       | editor            | Role: super_admin, admin, editor |
| avatar_url | text         | Yes      | null              | Profile picture URL              |
| created_at | timestamp    | No       | now()             | Account creation time            |

### 2. Event

Stores club events.

| Column      | Type         | Nullable | Default           | Description                        |
| ----------- | ------------ | -------- | ----------------- | ---------------------------------- |
| id          | uuid         | No       | gen_random_uuid() | Primary key                        |
| title       | varchar(255) | No       | -                 | Event title                        |
| description | text         | Yes      | null              | Event description                  |
| date        | date         | No       | -                 | Event date                         |
| time        | time         | Yes      | null              | Event time                         |
| location    | varchar(255) | Yes      | null              | Event location                     |
| cover_image | text         | Yes      | null              | Cover image URL                    |
| status      | enum         | No       | draft             | Status: draft, published, archived |
| created_by  | uuid         | No       | -                 | FK to User.id                      |
| created_at  | timestamp    | No       | now()             | Creation time                      |
| updated_at  | timestamp    | No       | now()             | Last update time                   |

### 3. EventImage

Multiple images per event.

| Column     | Type | Nullable | Default           | Description    |
| ---------- | ---- | -------- | ----------------- | -------------- |
| id         | uuid | No       | gen_random_uuid() | Primary key    |
| event_id   | uuid | No       | -                 | FK to Event.id |
| url        | text | No       | -                 | Image URL      |
| sort_order | int  | No       | 0                 | Display order  |

### 4. Album

Gallery albums.

| Column       | Type         | Nullable | Default           | Description             |
| ------------ | ------------ | -------- | ----------------- | ----------------------- |
| id           | uuid         | No       | gen_random_uuid() | Primary key             |
| title        | varchar(255) | No       | -                 | Album title             |
| description  | text         | Yes      | null              | Album description       |
| cover_image  | text         | Yes      | null              | Cover image URL         |
| event_id     | uuid         | Yes      | null              | Optional FK to Event.id |
| is_published | boolean      | No       | false             | Publication status      |
| created_by   | uuid         | No       | -                 | FK to User.id           |
| created_at   | timestamp    | No       | now()             | Creation time           |

### 5. GalleryImage

Images within albums.

| Column     | Type | Nullable | Default           | Description    |
| ---------- | ---- | -------- | ----------------- | -------------- |
| id         | uuid | No       | gen_random_uuid() | Primary key    |
| album_id   | uuid | No       | -                 | FK to Album.id |
| url        | text | No       | -                 | Image URL      |
| caption    | text | Yes      | null              | Image caption  |
| sort_order | int  | No       | 0                 | Display order  |

### 6. BoardMember

Board of Directors profiles.

| Column       | Type         | Nullable | Default           | Description          |
| ------------ | ------------ | -------- | ----------------- | -------------------- |
| id           | uuid         | No       | gen_random_uuid() | Primary key          |
| name         | varchar(255) | No       | -                 | Full name            |
| role         | varchar(255) | No       | -                 | Position title       |
| bio          | text         | Yes      | null              | Short biography      |
| email        | varchar(255) | Yes      | null              | Contact email        |
| linkedin_url | text         | Yes      | null              | LinkedIn profile URL |
| term_start   | date         | No       | -                 | Term start date      |
| term_end     | date         | No       | -                 | Term end date        |
| sort_order   | int          | No       | 0                 | Display order        |
| is_active    | boolean      | No       | true              | Currently serving    |

### 7. BoardMemberPhoto

Multiple photos per BOD member.

| Column    | Type | Nullable | Default           | Description          |
| --------- | ---- | -------- | ----------------- | -------------------- |
| id        | uuid | No       | gen_random_uuid() | Primary key          |
| member_id | uuid | No       | -                 | FK to BoardMember.id |
| url       | text | No       | -                 | Photo URL            |

### 8. Award

Club awards and recognitions.

| Column      | Type         | Nullable | Default           | Description         |
| ----------- | ------------ | -------- | ----------------- | ------------------- |
| id          | uuid         | No       | gen_random_uuid() | Primary key         |
| title       | varchar(255) | No       | -                 | Award title         |
| description | text         | Yes      | null              | Award description   |
| date        | date         | Yes      | null              | Award date          |
| recipient   | varchar(255) | Yes      | null              | Recipient name/team |
| category    | varchar(100) | No       | -                 | Award category      |
| created_by  | uuid         | No       | -                 | FK to User.id       |
| created_at  | timestamp    | No       | now()             | Creation time       |

### 9. AwardImage

Images for awards.

| Column   | Type | Nullable | Default           | Description    |
| -------- | ---- | -------- | ----------------- | -------------- |
| id       | uuid | No       | gen_random_uuid() | Primary key    |
| award_id | uuid | No       | -                 | FK to Award.id |
| url      | text | No       | -                 | Image URL      |

### 10. Collaboration

Partner organizations.

| Column            | Type         | Nullable | Default           | Description             |
| ----------------- | ------------ | -------- | ----------------- | ----------------------- |
| id                | uuid         | No       | gen_random_uuid() | Primary key             |
| name              | varchar(255) | No       | -                 | Organization name       |
| description       | text         | Yes      | null              | Partnership description |
| website_url       | text         | Yes      | null              | Partner website         |
| logo              | text         | Yes      | null              | Logo image URL          |
| partnership_start | date         | No       | -                 | Partnership start date  |
| is_active         | boolean      | No       | true              | Partnership status      |
| created_at        | timestamp    | No       | now()             | Creation time           |

### 11. CollaborationLogo

Multiple logo versions.

| Column           | Type | Nullable | Default           | Description            |
| ---------------- | ---- | -------- | ----------------- | ---------------------- |
| id               | uuid | No       | gen_random_uuid() | Primary key            |
| collaboration_id | uuid | No       | -                 | FK to Collaboration.id |
| url              | text | No       | -                 | Logo URL               |

### 12. Application

Membership applications.

| Column          | Type         | Nullable | Default           | Description                                         |
| --------------- | ------------ | -------- | ----------------- | --------------------------------------------------- |
| id              | uuid         | No       | gen_random_uuid() | Primary key                                         |
| name            | varchar(255) | No       | -                 | Applicant name                                      |
| email           | varchar(255) | No       | -                 | Applicant email                                     |
| phone           | varchar(50)  | Yes      | null              | Phone number                                        |
| college_company | varchar(255) | Yes      | null              | Institution/company                                 |
| reason          | text         | No       | -                 | Reason for joining                                  |
| status          | enum         | No       | pending           | Status: pending, approved, rejected, info_requested |
| reviewed_by     | uuid         | Yes      | null              | FK to User.id                                       |
| review_notes    | text         | Yes      | null              | Admin notes                                         |
| created_at      | timestamp    | No       | now()             | Submission time                                     |
| reviewed_at     | timestamp    | Yes      | null              | Review time                                         |

### 13. KnowledgeDocument

Uploaded documents for AI.

| Column       | Type         | Nullable | Default           | Description                       |
| ------------ | ------------ | -------- | ----------------- | --------------------------------- |
| id           | uuid         | No       | gen_random_uuid() | Primary key                       |
| title        | varchar(255) | No       | -                 | Document title                    |
| filename     | varchar(255) | No       | -                 | Original filename                 |
| file_size    | int          | No       | -                 | File size in bytes                |
| status       | enum         | No       | processing        | Status: processing, ready, failed |
| uploaded_by  | uuid         | No       | -                 | FK to User.id                     |
| chunk_count  | int          | No       | 0                 | Number of chunks created          |
| created_at   | timestamp    | No       | now()             | Upload time                       |
| processed_at | timestamp    | Yes      | null              | Processing completion time        |

### 14. DocumentChunk

Text chunks for RAG.

| Column      | Type         | Nullable | Default           | Description                |
| ----------- | ------------ | -------- | ----------------- | -------------------------- |
| id          | uuid         | No       | gen_random_uuid() | Primary key                |
| document_id | uuid         | No       | -                 | FK to KnowledgeDocument.id |
| content     | text         | No       | -                 | Chunk text content         |
| embedding   | vector(1536) | Yes      | null              | OpenAI embedding           |
| chunk_index | int          | No       | -                 | Order in document          |
| created_at  | timestamp    | No       | now()             | Creation time              |

### 15. SiteSettings

Key-value site configuration.

| Column     | Type         | Nullable | Default           | Description          |
| ---------- | ------------ | -------- | ----------------- | -------------------- |
| id         | uuid         | No       | gen_random_uuid() | Primary key          |
| key        | varchar(100) | No       | -                 | Setting key (unique) |
| value      | text         | Yes      | null              | Setting value        |
| updated_at | timestamp    | No       | now()             | Last update time     |

### 16. ChatLog

Chatbot interaction logs.

| Column     | Type         | Nullable | Default           | Description           |
| ---------- | ------------ | -------- | ----------------- | --------------------- |
| id         | uuid         | No       | gen_random_uuid() | Primary key           |
| session_id | varchar(255) | No       | -                 | Browser session ID    |
| message    | text         | No       | -                 | Message content       |
| role       | enum         | No       | -                 | Role: user, assistant |
| sources    | jsonb        | Yes      | null              | Referenced documents  |
| created_at | timestamp    | No       | now()             | Timestamp             |

## Relationships

- **User ? Event**: One-to-many (creator)
- **Event ? EventImage**: One-to-many
- **Album ? GalleryImage**: One-to-many
- **Album ? Event**: Many-to-one (optional)
- **BoardMember ? BoardMemberPhoto**: One-to-many
- **Award ? AwardImage**: One-to-many
- **Collaboration ? CollaborationLogo**: One-to-many
- **Application ? User**: Many-to-one (reviewer)
- **KnowledgeDocument ? DocumentChunk**: One-to-many
- **KnowledgeDocument ? User**: Many-to-one (uploader)

## Indexes

`sql
-- User
CREATE UNIQUE INDEX idx_user_email ON User(email);

-- Event
CREATE INDEX idx_event_date ON Event(date);
CREATE INDEX idx_event_status ON Event(status);
CREATE INDEX idx_event_created_by ON Event(created_by);

-- EventImage
CREATE INDEX idx_event_image_event_id ON EventImage(event_id);
CREATE INDEX idx_event_image_sort ON EventImage(event_id, sort_order);

-- Album
CREATE INDEX idx_album_published ON Album(is_published) WHERE is_published = true;
CREATE INDEX idx_album_event_id ON Album(event_id);

-- GalleryImage
CREATE INDEX idx_gallery_image_album_id ON GalleryImage(album_id);
CREATE INDEX idx_gallery_image_sort ON GalleryImage(album_id, sort_order);

-- BoardMember
CREATE INDEX idx_bod_active ON BoardMember(is_active) WHERE is_active = true;
CREATE INDEX idx_bod_sort ON BoardMember(sort_order);

-- Award
CREATE INDEX idx_award_date ON Award(date);
CREATE INDEX idx_award_category ON Award(category);

-- Application
CREATE INDEX idx_application_status ON Application(status);
CREATE INDEX idx_application_created_at ON Application(created_at);

-- KnowledgeDocument
CREATE INDEX idx_knowledge_doc_status ON KnowledgeDocument(status);
CREATE INDEX idx_knowledge_doc_uploaded_by ON KnowledgeDocument(uploaded_by);

-- DocumentChunk
CREATE INDEX idx_document_chunk_document_id ON DocumentChunk(document_id);
CREATE INDEX idx_document_chunk_embedding ON DocumentChunk USING ivfflat (embedding vector_cosine_ops);

-- SiteSettings
CREATE UNIQUE INDEX idx_site_settings_key ON SiteSettings(key);

-- ChatLog
CREATE INDEX idx_chat_log_session ON ChatLog(session_id);
CREATE INDEX idx_chat_log_created_at ON ChatLog(created_at);
`

## Naming Conventions

| Element      | Convention               | Example        |
| ------------ | ------------------------ | -------------- |
| Tables       | snake_case plural        | board_members  |
| Columns      | snake_case               | created_at     |
| Primary Keys | id (uuid)                | id             |
| Foreign Keys | {table_name_singular}_id | event_id       |
| Indexes      | idx_{table}_{column}     | idx_event_date |
| Enums        | snake_case               | user_role      |
| Timestamps   | created_at, updated_at   | -              |

## Constraints

- All id fields are UUIDs generated via gen_random_uuid().
- email must be unique across User table.
- status enums enforce valid states.
- sort_order defaults to 0 for ordering.
- is_active defaults to true for soft-active records.
- embedding column uses pgvector with cosine similarity index.
