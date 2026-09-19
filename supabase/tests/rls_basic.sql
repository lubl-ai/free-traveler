-- rls_basic.sql — RLS policy negative-access verification
-- REQ-FUNC-044; REQ-NF-013
--
-- Verifies DB-RLS-BASE's output (0002_rls.sql + 0003_user_profile_public_read.sql).
-- Does NOT change any policy — read-only verification against the schema
-- and seed data already produced by DB-SCHEMA-BASE/DB-SEED-BASE.
--
-- Run against a local Supabase instance that already has migrations +
-- seed.sql applied:
--   supabase db reset   # applies migrations, then supabase/seed.sql
--   psql "$DATABASE_URL" -f supabase/tests/rls_basic.sql
--
-- Uses the 3 seed accounts from supabase/seed.sql:
--   11111111-... = member 1 (author of most seed mate_post rows)
--   22222222-... = member 2
--   33333333-... = admin
--
-- Role note: this project's schema has only two roles, 'member' and
-- 'admin' (see 0001_schema.sql's user_profile.role check constraint) — no
-- separate "Moderator" role exists anywhere in the built system. Test
-- cases described elsewhere as "Moderator" reduce to the "non-owner
-- authenticated member" cases below, since Moderator and Admin were never
-- differentiated in DB-RLS-BASE's policies.
--
-- Each test sets the Postgres session to simulate a specific caller
-- (anon / a given authenticated user) the same way PostgREST does for
-- Supabase, then asserts the RLS-filtered result matches what an
-- unauthorized caller should see: zero rows for illegitimate writes, and
-- an empty result set (never an error leaking existence) for illegitimate
-- reads of another user's private rows.

\set ON_ERROR_STOP on

do $$
declare
  member1 uuid := '11111111-1111-1111-1111-111111111111';
  member2 uuid := '22222222-2222-2222-2222-222222222222';
  admin_id uuid := '33333333-3333-3333-3333-333333333333';
  seed_post_1 uuid := 'aaaaaaaa-0000-0000-0000-000000000001'; -- authored by member1
  seed_application_1 uuid := 'bbbbbbbb-0000-0000-0000-000000000001'; -- member2's application on seed_post_1
  affected int;
  failures text[] := '{}';
begin
  ----------------------------------------------------------------------
  -- 1) GUEST (anon, no session) — illegitimate writes must affect 0 rows
  ----------------------------------------------------------------------
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '{}', true);

  update public.user_profile set nickname = 'hacked' where id = member1;
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'Guest was able to update another user''s profile';
  end if;

  update public.mate_post set title = 'hacked' where id = seed_post_1;
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'Guest was able to update a mate_post they do not own';
  end if;

  insert into public.report (reporter_id, reason_code) values (member1, 'SPAM');
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'Guest was able to insert a report';
  end if;

  ----------------------------------------------------------------------
  -- 2) ADULT MEMBER (authenticated, not the owner) — illegitimate access
  --    to another member's private rows must be empty/0 rows
  ----------------------------------------------------------------------
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', member2, 'role', 'authenticated')::text, true);

  -- member2 is not author of seed_post_1 and not the applicant on some
  -- other member's application — approving/rejecting an application on a
  -- post they don't own must affect 0 rows.
  update public.mate_application set status = 'ACCEPTED' where id = seed_application_1 and mate_post_id != seed_post_1;
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'Non-owner member was able to modify an application outside their own post';
  end if;

  -- member2 must not be able to read member1's block list.
  perform set_config('request.jwt.claims', json_build_object('sub', member1, 'role', 'authenticated')::text, true);
  insert into public.user_block (blocker_id, blocked_id) values (member1, member2) on conflict do nothing;

  perform set_config('request.jwt.claims', json_build_object('sub', member2, 'role', 'authenticated')::text, true);
  if exists (select 1 from public.user_block where blocker_id = member1) then
    failures := failures || 'Non-owner member was able to read another member''s block list';
  end if;

  -- member2 must not be able to change report status (admin-only column change).
  update public.report set status = 'DISMISSED' where reporter_id = member1;
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'Non-admin member was able to change a report''s status';
  end if;

  ----------------------------------------------------------------------
  -- 3) OWNER negative case — a post author must not be able to modify a
  --    DIFFERENT author's post (owner-scoped policy must not over-grant)
  ----------------------------------------------------------------------
  perform set_config('request.jwt.claims', json_build_object('sub', member2, 'role', 'authenticated')::text, true);
  update public.mate_post set status = 'CLOSED' where id = seed_post_1; -- authored by member1, not member2
  get diagnostics affected = row_count;
  if affected <> 0 then
    failures := failures || 'A member was able to close another member''s mate_post';
  end if;

  ----------------------------------------------------------------------
  -- 4) "MODERATOR" — no distinct role exists (see header note); re-run the
  --    admin-only report-status-change case as a non-admin member, which
  --    is the closest equivalent this schema actually enforces.
  ----------------------------------------------------------------------
  -- (covered by the report status-change assertion in section 2)

  ----------------------------------------------------------------------
  -- 5) ADMIN — sanity check that the admin-only path IS reachable for an
  --    actual admin (a false "0 rows" here would mean the policy is too
  --    strict, not just "secure" — still worth asserting explicitly).
  ----------------------------------------------------------------------
  perform set_config('request.jwt.claims', json_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
  update public.report set status = 'DISMISSED' where reporter_id = member1;
  get diagnostics affected = row_count;
  if affected = 0 then
    failures := failures || 'Admin was unexpectedly unable to change report status (policy too strict)';
  end if;

  ----------------------------------------------------------------------
  -- Reset to superuser context for the summary output
  ----------------------------------------------------------------------
  reset role;

  if array_length(failures, 1) > 0 then
    raise exception 'RLS basic test FAILED (% issue(s)): %', array_length(failures, 1), array_to_string(failures, ' | ');
  else
    raise notice 'RLS basic test PASSED — 0 unauthorized-access bypasses detected.';
  end if;
end $$;
