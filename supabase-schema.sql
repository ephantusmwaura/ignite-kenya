-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (For admin settings and user profile)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  hero_title text default 'Invest in Future Leaders',
  hero_subtitle text default 'Every shilling goes directly towards materials, mentorship, and spaces that allow young creatives in Nakuru to thrive.',
  hero_image_url text, -- Placeholder image for "Free Art Education" tile
  gallery_hero_image_url text, -- Placeholder image for Gallery tile
  about_content text,
  mission_statement text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns to existing profiles table (in case table already exists)
alter table public.profiles add column if not exists hero_image_url text;
alter table public.profiles add column if not exists gallery_hero_image_url text;

-- 2. PROGRAMS
create table if not exists public.programs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text check (category in ('School Programs', 'Community Programs', 'Workshop Series')),
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROJECTS
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  status text check (status in ('Ongoing', 'Completed')),
  description text,
  image_url text,
  slug text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. GALLERY
create table if not exists public.gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  alt_text text,
  category text default 'General',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CONTACTS
create table if not exists public.contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. EVENTS
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  venue text not null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  ticket_price text,
  purchase_methods jsonb,
  category text check (category in ('Workshop', 'Exhibition', 'Community Event', 'Other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migration logic to ensure existing tables match the current schema
DO $$ 
BEGIN
    -- Remove legacy columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='event_time') THEN
        ALTER TABLE public.events DROP COLUMN event_time;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='max_tickets') THEN
        ALTER TABLE public.events DROP COLUMN max_tickets;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='tickets_sold') THEN
        ALTER TABLE public.events DROP COLUMN tickets_sold;
    END IF;

    -- Ensure new time columns exist (if table was created before the schema update)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='start_time') THEN
        ALTER TABLE public.events ADD COLUMN start_time TIME DEFAULT '09:00:00' NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='end_time') THEN
        ALTER TABLE public.events ADD COLUMN end_time TIME DEFAULT '17:00:00' NOT NULL;
    END IF;
END $$;

-- RLS SETTINGS
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.projects enable row level security;
alter table public.gallery enable row level security;
alter table public.contacts enable row level security;
alter table public.events enable row level security;

-- POLICIES (PUBLIC READ, ADMIN WRITE)

-- Profiles: Public read, only owner can update
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Programs: Public read, Authenticated write
drop policy if exists "Programs are viewable by everyone" on public.programs;
create policy "Programs are viewable by everyone" on public.programs for select using (true);

drop policy if exists "Authenticated users can manage programs" on public.programs;
create policy "Authenticated users can manage programs" on public.programs for all using (auth.role() = 'authenticated');

-- Projects: Public read, Authenticated write
drop policy if exists "Projects are viewable by everyone" on public.projects;
create policy "Projects are viewable by everyone" on public.projects for select using (true);

drop policy if exists "Authenticated users can manage projects" on public.projects;
create policy "Authenticated users can manage projects" on public.projects for all using (auth.role() = 'authenticated');

-- Gallery: Public read, Authenticated write
drop policy if exists "Gallery viewable by everyone" on public.gallery;
create policy "Gallery viewable by everyone" on public.gallery for select using (true);

drop policy if exists "Authenticated users can manage gallery" on public.gallery;
create policy "Authenticated users can manage gallery" on public.gallery for all using (auth.role() = 'authenticated');

-- Contacts: Public insert, Authenticated read/manage
drop policy if exists "Anyone can submit a contact form" on public.contacts;
create policy "Anyone can submit a contact form" on public.contacts for insert with check (true);

drop policy if exists "Authenticated users can manage contacts" on public.contacts;
create policy "Authenticated users can manage contacts" on public.contacts for all using (auth.role() = 'authenticated');

-- Events: Public read, Authenticated write
drop policy if exists "Events are viewable by everyone" on public.events;
create policy "Events are viewable by everyone" on public.events for select using (true);

drop policy if exists "Authenticated users can manage events" on public.events;
create policy "Authenticated users can manage events" on public.events for all using (auth.role() = 'authenticated');

-- FUNCTION TO HANDLE NEW USER SIGNUPS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER ON AUTH.USERS
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- 6. STORAGE BUCKETS
-- Create the ignite-media bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('ignite-media', 'ignite-media', true)
on conflict (id) do nothing;

-- Storage Policies: Public Read
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'ignite-media' );

-- Storage Policies: Authenticated Manage (Upload, Update, Delete)
drop policy if exists "Authenticated Manage" on storage.objects;
create policy "Authenticated Manage"
on storage.objects for all
using (
  bucket_id = 'ignite-media' 
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'ignite-media' 
  and auth.role() = 'authenticated'
);

-- 7. RATINGS
create table if not exists public.ratings (
  id uuid default uuid_generate_v4() primary key,
  target_id uuid not null, -- project_id or program_id
  target_type text check (target_type in ('project', 'program')),
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Public insert, Admin read
alter table public.ratings enable row level security;

-- Policy: Anyone can rate (insert)
drop policy if exists "Anyone can rate" on public.ratings;
create policy "Anyone can rate" on public.ratings for insert with check (true);

-- Policy: Everyone can view ratings (select) - needed for displaying average on public site
drop policy if exists "Public view ratings" on public.ratings;
create policy "Public view ratings" on public.ratings for select using (true);

-- 8. RESOURCES (Articles & Blogs)
create table if not exists public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  image_url text,
  type text check (type in ('article', 'blog')) not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS SETTINGS
alter table public.resources enable row level security;

-- POLICIES (PUBLIC READ, ADMIN WRITE)
drop policy if exists "Resources are viewable by everyone" on public.resources;
create policy "Resources are viewable by everyone" on public.resources for select using (true);

drop policy if exists "Authenticated users can manage resources" on public.resources;
create policy "Authenticated users can manage resources" on public.resources for all using (auth.role() = 'authenticated');
