-- Free Traveler — Base Schema
-- REQ-FUNC-028,029,031,034,035,039,040,044,077
--
-- Exactly 6 tables, scoped to Auth + Mate (동행) features only.
-- Destinations, safety info, and representative profile are static TS data
-- (src/data/*.ts) and never get a table here (docs/ARCHITECTURE.md §7).
-- No birthdate column anywhere — only a boolean adult-verification flag
-- and its verification timestamp (REQ-FUNC-028, privacy minimization).

-- ============================================================
-- USER_PROFILE — member profile, extends auth.users 1:1
-- ============================================================
create table public.user_profile (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 50),
  role text not null default 'member' check (role in ('member', 'admin')),
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_profile is 'Member profile + adult-verification status. No birthdate stored (REQ-FUNC-028).';

-- ============================================================
-- MATE_POST — travel-mate recruitment posts
-- ============================================================
create table public.mate_post (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.user_profile (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  country text not null,
  region text,
  start_date date not null,
  end_date date not null,
  max_participants integer not null check (max_participants > 0),
  conditions text,
  style text,
  description text not null check (char_length(description) between 1 and 3000),
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  safety_policy_version text not null,
  safety_agreed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_post_date_order check (end_date >= start_date)
);

comment on table public.mate_post is 'Mate recruitment posts. status=CLOSED can be set explicitly; API layer also treats past-end_date posts as CLOSED on read without a batch job.';

-- ============================================================
-- MATE_APPLICATION — participation requests on a mate post
-- ============================================================
create table public.mate_application (
  id uuid primary key default gen_random_uuid(),
  mate_post_id uuid not null references public.mate_post (id) on delete cascade,
  applicant_id uuid not null references public.user_profile (id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.mate_application is 'Private participation requests. message is visible only to the applicant and the post author (RLS).';

-- One active (PENDING or ACCEPTED) request per applicant per post.
create unique index mate_application_active_unique
  on public.mate_application (mate_post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');

-- ============================================================
-- USER_BLOCK — blocking relationships between members
-- ============================================================
create table public.user_block (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.user_profile (id) on delete cascade,
  blocked_id uuid not null references public.user_profile (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_block_no_self_block check (blocker_id <> blocked_id),
  constraint user_block_unique unique (blocker_id, blocked_id)
);

comment on table public.user_block is 'Blocking relationships; only the blocker may read/write their own block rows.';

-- ============================================================
-- REPORT — reports against a user or a mate post
-- ============================================================
create table public.report (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.user_profile (id) on delete cascade,
  reported_user_id uuid references public.user_profile (id) on delete set null,
  reported_mate_post_id uuid references public.mate_post (id) on delete set null,
  reason_code text not null,
  description text,
  status text not null default 'OPEN' check (status in ('OPEN', 'RESOLVED', 'DISMISSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.report is 'Reports against a user and/or a mate post. Reporter/reported detail is admin-only (RLS).';

-- ============================================================
-- APP_SETTING — admin-managed external URLs (flight/hotel outbound)
-- ============================================================
create table public.app_setting (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.user_profile (id) on delete set null
);

comment on table public.app_setting is 'Admin-configured external outbound URLs (e.g. FLIGHT_OUTBOUND_URL, HOTEL_OUTBOUND_URL). HTTPS allowlist enforcement happens in API-ADMIN-SETTINGS, not here.';

-- ============================================================
-- Indexes for common access patterns
-- ============================================================
create index mate_post_author_idx on public.mate_post (author_id);
create index mate_post_status_idx on public.mate_post (status);
create index mate_application_post_idx on public.mate_application (mate_post_id);
create index mate_application_applicant_idx on public.mate_application (applicant_id);
create index user_block_blocker_idx on public.user_block (blocker_id);
create index report_reporter_idx on public.report (reporter_id);
create index report_status_idx on public.report (status);
