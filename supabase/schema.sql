-- RCPU Official Supabase Database Schema
-- Run this script in your Supabase SQL Editor to initialize all tables, RLS policies, and triggers.

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SITE SETTINGS & CONFIGURATION
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    university_address TEXT NOT NULL DEFAULT 'Presidency University Campus, Dibburu, Itgalpur, Rajankunte, Yelahanka, Bengaluru, Karnataka 560064',
    phone TEXT NOT NULL DEFAULT '+91 8884466773',
    email TEXT NOT NULL DEFAULT 'rotaractcpu@gmail.com',
    membership_form_url TEXT NOT NULL DEFAULT 'https://forms.google.com/',
    google_sheets_members_id TEXT,
    google_sheets_projects_id TEXT,
    google_sheets_bod_id TEXT,
    google_calendar_id TEXT,
    instagram TEXT,
    linkedin TEXT,
    youtube TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. BOARD OF DIRECTORS (BOD)
CREATE TABLE IF NOT EXISTS bod_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Director',
    bio TEXT,
    quote TEXT,
    image_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    email TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category TEXT NOT NULL,
    date DATE,
    venue TEXT,
    cover_image TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. HISTORICAL / PAST EVENTS
CREATE TABLE IF NOT EXISTS historical_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    date DATE,
    time_str TEXT,
    location TEXT,
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    folder_id TEXT UNIQUE,
    platform TEXT,
    participants INT,
    beneficiaries INT,
    collaborators JSONB DEFAULT '[]'::jsonb,
    registration_link TEXT,
    cover_image TEXT,
    short_description TEXT,
    detailed_description TEXT,
    source TEXT NOT NULL DEFAULT 'cms' CHECK (source IN ('cms', 'drive', 'calendar', 'local')),
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AVENUES
CREATE TABLE IF NOT EXISTS avenues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0
);

-- 10. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other',
    file_size INT,
    mime_type TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. FAQS
CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE
);

-- 12. TIMELINE MILESTONES
CREATE TABLE IF NOT EXISTS timeline_items (
    id TEXT PRIMARY KEY,
    year_label TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 13. AWARDS
CREATE TABLE IF NOT EXISTS awards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    awarding_body TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE
);

-- 14. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    organization TEXT,
    avatar_url TEXT,
    is_published BOOLEAN DEFAULT TRUE
);

-- 15. PARTNERS
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Safe upgrades for databases created before the real-data integration.
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS youtube TEXT;
ALTER TABLE historical_events ALTER COLUMN date DROP NOT NULL;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS folder_id TEXT UNIQUE;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS participants INT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS beneficiaries INT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS collaborators JSONB DEFAULT '[]'::jsonb;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS registration_link TEXT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'cms';
ALTER TABLE historical_events DROP CONSTRAINT IF EXISTS historical_events_source_check;
ALTER TABLE historical_events ADD CONSTRAINT historical_events_source_check CHECK (source IN ('cms', 'drive', 'calendar', 'local'));

-- Cached, source-grounded summaries. These are intentionally independent of
-- the source tables so a Drive/Calendar refresh cannot overwrite an approved
-- description.
CREATE TABLE IF NOT EXISTS event_descriptions (
    event_id TEXT NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    source_hash TEXT PRIMARY KEY,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT,
    state TEXT NOT NULL DEFAULT 'ready',
    generation_id UUID,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE event_descriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read event descriptions" ON event_descriptions;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read bod_members" ON bod_members;
CREATE POLICY "Public read bod_members" ON bod_members FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read published projects" ON projects;
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (status = 'PUBLISHED');
DROP POLICY IF EXISTS "Public read published events" ON historical_events;
CREATE POLICY "Public read published events" ON historical_events FOR SELECT USING (status = 'PUBLISHED');

-- Writes are exclusively through authenticated, role-checked server APIs using
-- the service role. No client-side profile policy can escalate its own role.
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
DROP POLICY IF EXISTS "Admin write bod_members" ON bod_members;
DROP POLICY IF EXISTS "Admin write projects" ON projects;

-- Idempotent upgrades for existing installations.
ALTER TABLE bod_members ALTER COLUMN image_url DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN short_description DROP NOT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS objective TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS time_str TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS participants INT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiaries INT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS volunteers INT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS collaborators JSONB DEFAULT '[]'::jsonb;
ALTER TABLE historical_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE event_descriptions ALTER COLUMN short_description DROP NOT NULL;
ALTER TABLE event_descriptions ALTER COLUMN detailed_description DROP NOT NULL;
ALTER TABLE event_descriptions ALTER COLUMN provider SET DEFAULT 'openai';
ALTER TABLE event_descriptions ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT 'ready';
ALTER TABLE event_descriptions ADD COLUMN IF NOT EXISTS generation_id UUID;
ALTER TABLE event_descriptions DROP CONSTRAINT IF EXISTS event_descriptions_pkey;
CREATE UNIQUE INDEX IF NOT EXISTS event_descriptions_source_hash_idx ON event_descriptions(source_hash);
CREATE TABLE IF NOT EXISTS content_documents (
  id TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE content_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ALTER COLUMN membership_form_url SET DEFAULT '';
