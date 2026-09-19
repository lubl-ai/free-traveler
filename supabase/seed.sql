-- Free Traveler — Local/dev seed data
-- Supports E2E (E2E-MATE-AUTH, E2E-TRAVEL-TOOLS) and RLS (TEST-RLS-BASIC) testing.
-- Dummy data only — no real personal information, fixed test-only UUIDs/emails.
-- Run against a local Supabase instance only (`supabase db reset` applies
-- migrations then this file); never run against production.

-- ============================================================
-- Test accounts (3): 2 regular members + 1 admin
-- Password for all seed accounts: "seed-test-password" (local/dev only)
-- ============================================================
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'seed-member-1@example.test',
    crypt('seed-test-password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'seed-member-2@example.test',
    crypt('seed-test-password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'seed-admin@example.test',
    crypt('seed-test-password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false, false
  )
on conflict (id) do nothing;

-- ============================================================
-- USER_PROFILE rows for the 3 seed accounts
-- ============================================================
insert into public.user_profile (id, nickname, role, is_adult, adult_verified_at) values
  ('11111111-1111-1111-1111-111111111111', '테스트여행자1', 'member', true, now()),
  ('22222222-2222-2222-2222-222222222222', '테스트여행자2', 'member', true, now()),
  ('33333333-3333-3333-3333-333333333333', '테스트관리자', 'admin', true, now())
on conflict (id) do nothing;

-- ============================================================
-- MATE_POST rows (4): mix of OPEN and CLOSED for status-filter tests
-- ============================================================
insert into public.mate_post (
  id, author_id, title, country, region, start_date, end_date,
  max_participants, conditions, style, description, status,
  safety_policy_version, safety_agreed_at
) values
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '[Seed] 오사카 벚꽃 여행 동행 구해요',
    '일본', '오사카',
    current_date + interval '30 days', current_date + interval '34 days',
    3, '20-30대 선호', '느긋한 일정, 사진 촬영 좋아하는 분',
    '오사카 벚꽃 시즌에 4박 5일 일정으로 같이 다닐 동행을 찾습니다. 도톤보리, 오사카성, 유니버설 스튜디오 방문 예정입니다.',
    'OPEN', '1.0', now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    '[Seed] 방콕 미식 여행 함께 하실 분',
    '태국', '방콕',
    current_date + interval '10 days', current_date + interval '13 days',
    2, '음식 좋아하는 분', '맛집 탐방 위주',
    '방콕 로컬 맛집과 야시장 위주로 3박 4일 여행 계획 중입니다. 매운 음식 잘 드시는 분 환영합니다.',
    'OPEN', '1.0', now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    '[Seed] 파리 미술관 투어 동행',
    '프랑스', '파리',
    current_date + interval '60 days', current_date + interval '67 days',
    4, '미술/역사 관심 있는 분', '박물관 위주 일정',
    '루브르, 오르세, 퐁피두 등 파리 주요 미술관을 여유롭게 둘러보는 7박 8일 일정입니다.',
    'OPEN', '1.0', now()
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '22222222-2222-2222-2222-222222222222',
    '[Seed] 지난 발리 서핑 여행 (마감)',
    '인도네시아', '발리',
    current_date - interval '40 days', current_date - interval '35 days',
    2, '서핑 경험자', '액티비티 위주',
    '이미 마감된 과거 여행 모집글입니다. CLOSED 상태 테스트용 데이터입니다.',
    'CLOSED', '1.0', now() - interval '45 days'
  )
on conflict (id) do nothing;

-- ============================================================
-- MATE_APPLICATION (1): pending request from member-2 on member-1's post
-- ============================================================
insert into public.mate_application (id, mate_post_id, applicant_id, message, status) values
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    '[Seed] 안녕하세요, 오사카 여행 일정 함께하고 싶습니다. 사진 찍는 것 좋아해요!',
    'PENDING'
  )
on conflict (id) do nothing;

-- ============================================================
-- REPORT (2): one open, one resolved — for admin-tab + RLS tests
-- ============================================================
insert into public.report (
  id, reporter_id, reported_user_id, reported_mate_post_id,
  reason_code, description, status
) values
  (
    'cccccccc-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'INAPPROPRIATE_CONTENT',
    '[Seed] 테스트용 신고 — 부적절한 내용 신고 접수 케이스',
    'OPEN'
  ),
  (
    'cccccccc-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'SPAM',
    '[Seed] 테스트용 신고 — 이미 처리 완료된 케이스',
    'RESOLVED'
  )
on conflict (id) do nothing;

-- ============================================================
-- APP_SETTING: default outbound URLs so travel-tools E2E has a value
-- ============================================================
insert into public.app_setting (key, value, updated_by) values
  ('FLIGHT_OUTBOUND_URL', 'https://www.google.com/travel/flights', '33333333-3333-3333-3333-333333333333'),
  ('HOTEL_OUTBOUND_URL', 'https://www.booking.com', '33333333-3333-3333-3333-333333333333')
on conflict (key) do nothing;
