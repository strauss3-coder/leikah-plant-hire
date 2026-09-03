-- ============================================================================
-- LEIKAH PLANT HIRE — CORE SCHEMA
--
-- Design notes
--
--  * Content tables share one shape: identity and ordering live in columns
--    (id, slug, sort, status) and the typed payload lives in `data` (jsonb).
--    The public site and the portal both go through that single shape, so a new
--    field on a content type is a portal schema change, not a migration.
--
--  * Nothing is ever hard-deleted from a content table. `deleted_at` is set and
--    every read filters it out, which means an accidental delete in the portal
--    is recoverable rather than final.
--
--  * Every write is recorded in `audit_log` by trigger, not by application
--    code, so an edit made outside the portal is captured too.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------------

do $$ begin
  create type content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type portal_role as enum ('owner', 'admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_status as enum ('new', 'reviewing', 'quoted', 'won', 'lost', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type urgency_level as enum ('emergency', 'urgent', 'scheduled', 'planning');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Portal users
--
-- Mirrors auth.users with the role the portal enforces. A row here is what
-- grants access; deleting it revokes access without touching the auth record.
-- ---------------------------------------------------------------------------

create table if not exists portal_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        portal_role not null default 'viewer',
  active      boolean not null default true,
  last_seen_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists portal_users_role_idx on portal_users (role) where active;

-- Helper predicates used by every policy below. `security definer` so they can
-- read portal_users without the caller needing a policy on it first.
create or replace function portal_role_of(uid uuid)
returns portal_role
language sql
stable
security definer
set search_path = public
as $$
  select role from portal_users where id = uid and active;
$$;

create or replace function is_portal_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from portal_users where id = auth.uid() and active);
$$;

create or replace function can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select portal_role_of(auth.uid()) in ('owner', 'admin', 'editor');
$$;

create or replace function is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select portal_role_of(auth.uid()) in ('owner', 'admin');
$$;

-- ---------------------------------------------------------------------------
-- Timestamp trigger
-- ---------------------------------------------------------------------------

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content tables
--
-- Created from one template so the shape cannot drift between collections.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  tables text[] := array[
    'content_services',
    'content_fleet',
    'content_industries',
    'content_projects',
    'content_testimonials',
    'content_faqs',
    'content_gallery',
    'content_clients',
    'content_documents',
    'content_news',
    'content_careers',
    'content_departments',
    'content_staff',
    'content_divisions'
  ];
begin
  foreach t in array tables loop
    execute format($f$
      create table if not exists %I (
        id          uuid primary key default gen_random_uuid(),
        slug        text,
        sort        integer not null default 0,
        status      content_status not null default 'draft',
        data        jsonb not null default '{}'::jsonb,
        created_at  timestamptz not null default now(),
        updated_at  timestamptz not null default now(),
        created_by  uuid references portal_users(id) on delete set null,
        updated_by  uuid references portal_users(id) on delete set null,
        deleted_at  timestamptz
      );
    $f$, t);

    -- Slugs must be unique among rows that still exist.
    execute format(
      'create unique index if not exists %I on %I (slug) where slug is not null and deleted_at is null;',
      t || '_slug_key', t
    );

    -- The exact predicate the public site reads with.
    execute format(
      'create index if not exists %I on %I (sort) where deleted_at is null and status = ''published'';',
      t || '_live_idx', t
    );

    execute format(
      'create index if not exists %I on %I using gin (data jsonb_path_ops);',
      t || '_data_idx', t
    );

    execute format(
      'drop trigger if exists %I on %I;', t || '_touch', t
    );
    execute format(
      'create trigger %I before update on %I for each row execute function touch_updated_at();',
      t || '_touch', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Singletons — business info, home, about, safety, page headers
-- ---------------------------------------------------------------------------

create table if not exists content_singletons (
  key         text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references portal_users(id) on delete set null
);

drop trigger if exists content_singletons_touch on content_singletons;
create trigger content_singletons_touch
  before update on content_singletons
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Media library
--
-- Rows describe objects in the `media` storage bucket. Alt text lives here so
-- accessibility is editable content rather than a code constant.
-- ---------------------------------------------------------------------------

create table if not exists media_assets (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null default '',
  alt           text not null default '',
  caption       text,
  tags          text[] not null default '{}',
  storage_path  text,
  mime_type     text,
  width         integer,
  height        integer,
  bytes         bigint,
  blur_data_url text,
  sort          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references portal_users(id) on delete set null,
  deleted_at    timestamptz
);

create index if not exists media_assets_tags_idx on media_assets using gin (tags);
create index if not exists media_assets_title_idx on media_assets using gin (title gin_trgm_ops);

drop trigger if exists media_assets_touch on media_assets;
create trigger media_assets_touch
  before update on media_assets
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Enquiries
--
-- These carry personal information, so they use explicit columns rather than
-- jsonb: it makes retention, export and deletion requests straightforward.
-- ---------------------------------------------------------------------------

create table if not exists quote_requests (
  id              uuid primary key default gen_random_uuid(),
  reference       text unique not null,
  company         text not null,
  contact_name    text not null,
  role            text,
  email           text not null,
  phone           text not null,
  service_slugs   text[] not null default '{}',
  industry_slug   text,
  site_location   text not null,
  province        text not null,
  urgency         urgency_level not null default 'scheduled',
  preferred_start date,
  duration        text,
  budget_band     text,
  description     text not null,
  attachments     jsonb not null default '[]'::jsonb,
  consent         boolean not null default false,
  source          text,
  status          enquiry_status not null default 'new',
  assigned_to     uuid references portal_users(id) on delete set null,
  internal_notes  text,
  quoted_value    numeric(12,2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists quote_requests_status_idx on quote_requests (status, created_at desc);
create index if not exists quote_requests_urgency_idx on quote_requests (urgency, created_at desc);
create index if not exists quote_requests_email_idx on quote_requests (lower(email));

drop trigger if exists quote_requests_touch on quote_requests;
create trigger quote_requests_touch
  before update on quote_requests
  for each row execute function touch_updated_at();

create table if not exists contact_messages (
  id             uuid primary key default gen_random_uuid(),
  reference      text unique not null,
  name           text not null,
  email          text not null,
  phone          text,
  company        text,
  department     text not null,
  subject        text not null,
  message        text not null,
  consent        boolean not null default false,
  status         enquiry_status not null default 'new',
  assigned_to    uuid references portal_users(id) on delete set null,
  internal_notes text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on contact_messages (status, created_at desc);

drop trigger if exists contact_messages_touch on contact_messages;
create trigger contact_messages_touch
  before update on contact_messages
  for each row execute function touch_updated_at();

create table if not exists job_applications (
  id             uuid primary key default gen_random_uuid(),
  reference      text unique not null,
  name           text not null,
  email          text not null,
  phone          text not null,
  role           text not null,
  experience     text not null,
  competencies   text,
  cv             jsonb,
  consent        boolean not null default false,
  status         enquiry_status not null default 'new',
  internal_notes text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists job_applications_status_idx on job_applications (status, created_at desc);

drop trigger if exists job_applications_touch on job_applications;
create trigger job_applications_touch
  before update on job_applications
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Customers
--
-- Built now because quotes and (future) invoices both need to hang off a
-- customer record rather than off a repeated company name string.
-- ---------------------------------------------------------------------------

create table if not exists customers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  trading_name   text,
  registration   text,
  vat_number     text,
  industry_slug  text,
  contact_name   text,
  email          text,
  phone          text,
  address        text,
  notes          text,
  status         text not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

create index if not exists customers_name_idx on customers using gin (name gin_trgm_ops);

drop trigger if exists customers_touch on customers;
create trigger customers_touch
  before update on customers
  for each row execute function touch_updated_at();

-- Link an enquiry to a customer once it is qualified.
alter table quote_requests
  add column if not exists customer_id uuid references customers(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Site settings — appearance, SEO defaults, feature switches
-- ---------------------------------------------------------------------------

create table if not exists site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  description text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references portal_users(id) on delete set null
);

drop trigger if exists site_settings_touch on site_settings;
create trigger site_settings_touch
  before update on site_settings
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Audit log
--
-- Attached by trigger to every table that matters. Records the actor, the
-- action and the row snapshot, so "who changed the phone number" has an answer.
-- ---------------------------------------------------------------------------

create table if not exists audit_log (
  id          bigserial primary key,
  table_name  text not null,
  row_id      text,
  action      text not null,
  actor_id    uuid,
  actor_email text,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_table_idx on audit_log (table_name, created_at desc);
create index if not exists audit_log_actor_idx on audit_log (actor_id, created_at desc);

create or replace function write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_mail text;
  row_key text;
begin
  select email into actor_mail from portal_users where id = actor;

  row_key := case
    when tg_op = 'DELETE' then (to_jsonb(old) ->> 'id')
    else (to_jsonb(new) ->> 'id')
  end;

  insert into audit_log (table_name, row_id, action, actor_id, actor_email, before, after)
  values (
    tg_table_name,
    row_key,
    tg_op,
    actor,
    actor_mail,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );

  return coalesce(new, old);
end;
$$;

do $$
declare
  t text;
  audited text[] := array[
    'content_services', 'content_fleet', 'content_industries', 'content_projects',
    'content_testimonials', 'content_faqs', 'content_gallery',
    'content_clients', 'content_documents', 'content_news',
    'content_careers', 'content_departments', 'content_staff',
    'content_divisions', 'content_singletons', 'media_assets',
    'site_settings', 'portal_users', 'customers', 'quote_requests'
  ];
begin
  foreach t in array audited loop
    execute format('drop trigger if exists %I on %I;', t || '_audit', t);
    execute format(
      'create trigger %I after insert or update or delete on %I for each row execute function write_audit_log();',
      t || '_audit', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Dashboard view — one query for the portal's opening screen
-- ---------------------------------------------------------------------------

create or replace view portal_dashboard_counts as
select
  (select count(*) from quote_requests where status = 'new') as new_quotes,
  (select count(*) from quote_requests where urgency = 'emergency' and status = 'new') as emergency_quotes,
  (select count(*) from contact_messages where status = 'new') as new_messages,
  (select count(*) from job_applications where status = 'new') as new_applications,
  (select count(*) from content_services where deleted_at is null and status = 'published') as live_services,
  (select count(*) from content_projects where deleted_at is null and status = 'published') as live_projects,
  (select count(*) from content_testimonials where deleted_at is null and status = 'published') as live_testimonials,
  (select count(*) from media_assets where deleted_at is null) as media_count;
