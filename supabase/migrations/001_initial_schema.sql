-- Enable required extension
create extension if not exists pgcrypto;

-- =========================
-- profiles
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'chat_team', 'content_team')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);

-- =========================
-- chat_sessions
-- =========================
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  session_token text not null unique,
  source_page text,
  status text not null default 'new'
    check (status in ('new', 'open', 'contacted', 'closed', 'spam')),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_status on public.chat_sessions(status);
create index if not exists idx_chat_sessions_assigned_to on public.chat_sessions(assigned_to);
create index if not exists idx_chat_sessions_created_at on public.chat_sessions(created_at desc);

-- =========================
-- chat_messages
-- =========================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'admin', 'system')),
  message_text text not null,
  attachment_url text,
  sent_to_whatsapp boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at desc);

-- =========================
-- leads
-- =========================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  full_name text not null,
  email text,
  phone text,
  company text,
  message text not null,
  source_page text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_form_type on public.leads(form_type);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

-- =========================
-- lead_notes
-- =========================
create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  note text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_notes_lead_id on public.lead_notes(lead_id);
create index if not exists idx_lead_notes_created_by on public.lead_notes(created_by);

-- =========================
-- blog_posts
-- =========================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_author_id on public.blog_posts(author_id);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);

-- =========================
-- portfolio_projects
-- =========================
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  cover_image text,
  gallery_images jsonb not null default '[]'::jsonb,
  technologies jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  client_name text,
  industry text,
  project_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_portfolio_projects_status on public.portfolio_projects(status);
create index if not exists idx_portfolio_projects_featured on public.portfolio_projects(featured);
create index if not exists idx_portfolio_projects_sort_order on public.portfolio_projects(sort_order);
create index if not exists idx_portfolio_projects_author_id on public.portfolio_projects(author_id);

-- =========================
-- media_files
-- =========================
create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  alt_text text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_files_uploaded_by on public.media_files(uploaded_by);
create index if not exists idx_media_files_created_at on public.media_files(created_at desc);

-- =========================
-- notifications_log
-- =========================
create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  channel text not null check (channel in ('email', 'whatsapp', 'dashboard')),
  target text,
  status text not null check (status in ('pending', 'sent', 'failed')),
  payload_summary text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_log_event_type on public.notifications_log(event_type);
create index if not exists idx_notifications_log_channel on public.notifications_log(channel);
create index if not exists idx_notifications_log_status on public.notifications_log(status);

-- =========================
-- activity_logs
-- =========================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_actor_id on public.activity_logs(actor_id);
create index if not exists idx_activity_logs_entity_type on public.activity_logs(entity_type);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- =========================
-- updated_at trigger helper
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_chat_sessions_updated_at on public.chat_sessions;
create trigger trg_chat_sessions_updated_at
before update on public.chat_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

drop trigger if exists trg_portfolio_projects_updated_at on public.portfolio_projects;
create trigger trg_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row
execute function public.set_updated_at();