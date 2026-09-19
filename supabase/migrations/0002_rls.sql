-- Free Traveler — Row Level Security policies
-- REQ-FUNC-033,044; REQ-NF-013
--
-- Three simple rules only (docs/ARCHITECTURE.md §9), no hierarchical or
-- custom-function-based fine-grained policies:
--   1. Own row only        — USER_PROFILE, USER_BLOCK
--   2. Author/participant  — MATE_POST (public read, author writes),
--                            MATE_APPLICATION (applicant + post author)
--   3. Admin only           — REPORT/APP_SETTING writes gated on
--                            user_profile.role = 'admin'

alter table public.user_profile enable row level security;
alter table public.mate_post enable row level security;
alter table public.mate_application enable row level security;
alter table public.user_block enable row level security;
alter table public.report enable row level security;
alter table public.app_setting enable row level security;

-- ============================================================
-- USER_PROFILE — own row only
-- ============================================================
create policy user_profile_select_own
  on public.user_profile for select
  using (id = auth.uid());

create policy user_profile_insert_own
  on public.user_profile for insert
  with check (id = auth.uid());

create policy user_profile_update_own
  on public.user_profile for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- MATE_POST — public read, author-only write
-- ============================================================
create policy mate_post_select_all
  on public.mate_post for select
  using (true);

create policy mate_post_insert_own
  on public.mate_post for insert
  with check (author_id = auth.uid());

create policy mate_post_update_own
  on public.mate_post for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy mate_post_delete_own
  on public.mate_post for delete
  using (author_id = auth.uid());

-- ============================================================
-- MATE_APPLICATION — applicant and post author only
-- ============================================================
create policy mate_application_select_participant
  on public.mate_application for select
  using (
    applicant_id = auth.uid()
    or mate_post_id in (select id from public.mate_post where author_id = auth.uid())
  );

create policy mate_application_insert_own
  on public.mate_application for insert
  with check (applicant_id = auth.uid());

-- Only the post author may change status (approve/reject).
create policy mate_application_update_post_author
  on public.mate_application for update
  using (mate_post_id in (select id from public.mate_post where author_id = auth.uid()))
  with check (mate_post_id in (select id from public.mate_post where author_id = auth.uid()));

-- Applicant may withdraw their own request.
create policy mate_application_delete_own
  on public.mate_application for delete
  using (applicant_id = auth.uid());

-- ============================================================
-- USER_BLOCK — own rows only (as blocker)
-- ============================================================
create policy user_block_select_own
  on public.user_block for select
  using (blocker_id = auth.uid());

create policy user_block_insert_own
  on public.user_block for insert
  with check (blocker_id = auth.uid());

create policy user_block_delete_own
  on public.user_block for delete
  using (blocker_id = auth.uid());

-- ============================================================
-- REPORT — reporter reads own; admin reads/updates all
-- ============================================================
create policy report_select_own_or_admin
  on public.report for select
  using (
    reporter_id = auth.uid()
    or (select role from public.user_profile where id = auth.uid()) = 'admin'
  );

create policy report_insert_own
  on public.report for insert
  with check (reporter_id = auth.uid());

create policy report_update_admin_only
  on public.report for update
  using ((select role from public.user_profile where id = auth.uid()) = 'admin')
  with check ((select role from public.user_profile where id = auth.uid()) = 'admin');

-- ============================================================
-- APP_SETTING — public read (outbound URLs power public travel-tools
-- links), admin-only write
-- ============================================================
create policy app_setting_select_all
  on public.app_setting for select
  using (true);

create policy app_setting_insert_admin_only
  on public.app_setting for insert
  with check ((select role from public.user_profile where id = auth.uid()) = 'admin');

create policy app_setting_update_admin_only
  on public.app_setting for update
  using ((select role from public.user_profile where id = auth.uid()) = 'admin')
  with check ((select role from public.user_profile where id = auth.uid()) = 'admin');
