# DEPLOY-VERCEL-SUPABASE-CHECK — 배포 체크리스트

REQ-NF-012,016,034 / `TASKS/TASK-DEPLOY-VERCEL-SUPABASE-CHECK.md`

이 문서는 Vercel 배포 직후 **사람이 실제 배포된 URL에서** 수행해야 하는 확인
목록이다. 로컬 샌드박스에는 인터넷 접근과 실제 Vercel/Supabase 프로젝트가
없어 이 Task의 Verify("수동 확인(배포 후 브라우저 점검)")를 여기서 자동으로
완료할 수 없다 — CLAUDE.md 규칙 22와 동일하게, 사람이 아래 항목을 실제로
확인한 뒤 체크박스를 채우는 것이 이 Task의 완료 조건이다.

`vercel.json`은 만들지 않았다 — 이 프로젝트는 표준 Next.js App Router 구조라
Vercel Zero-config로 빌드/배포되며, 추가 설정이 필요한 라우팅·헤더·리다이렉트
규칙이 없다(추가하면 오히려 Expected Files 밖의 불필요한 설정이 된다).

## 로컬에서 이미 확인된 항목 (코드 감사, 이 세션에서 검증 완료)

- [x] 클라이언트 번들에 노출되는 환경변수는 `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` 2개뿐이다 (`src/lib/supabase/client.ts`).
      Supabase anon key는 RLS로 보호되는 것을 전제로 공개되는 키이므로
      노출이 설계상 정상이다.
- [x] `src/` 전체에서 `SERVICE_ROLE`/`SERVICE_ROLE_KEY` 문자열 검색 결과 0건 —
      Service Role Key를 참조하는 코드 자체가 없다.
- [x] 서버 전용 Supabase 클라이언트(`src/lib/db/client.ts`)도 anon key만
      사용하며 `import 'server-only'`로 클라이언트 번들 유입을 빌드 타임에
      차단한다.
- [x] `npm run build` 성공 (정적/동적 라우트 13개 생성 확인).

## 배포 후 사람이 확인할 항목

- [ ] Vercel 배포 완료 후, 아래 5개 Route가 실제로 접근 가능하다.
  - [ ] `/` (SCR-001)
  - [ ] `/about` (SCR-002)
  - [ ] `/travel-tools` (SCR-003)
  - [ ] `/mates` (SCR-004)
  - [ ] `/account` (SCR-005)
- [ ] 배포된 페이지의 클라이언트 번들(브라우저 DevTools → Sources 또는
      `view-source:`)에서 Supabase Service Role Key, DB 비밀번호 등
      `NEXT_PUBLIC_` 접두어가 없는 비밀값이 검색되지 않는다.
- [ ] Vercel 프로젝트 설정(Environment Variables) 화면에서만
      `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`(및 필요 시
      항공/숙소 외부 URL 값)가 존재하고, 저장소 코드에는 실제 값이 커밋되어
      있지 않다(`.env`/`.env.local`은 `.gitignore`로 제외되어 있는지 확인).
- [ ] 배포 URL이 `https://`로만 접근되고 HTTP 요청은 HTTPS로 리다이렉트된다
      (Vercel 기본 제공 TLS).
- [ ] Vercel 프로젝트가 Hobby(무료) 또는 Pro 최저 티어 범위 내에서 운영되고,
      Supabase 프로젝트도 Free/저가 티어 범위 내에 있다(EC2·AWS 등 별도
      인프라를 구성하지 않았음을 재확인 — CLAUDE.md 규칙 17).

## 완료 처리

위 "배포 후 사람이 확인할 항목"을 실제 배포 URL에서 확인한 뒤, 각 체크박스를
`[x]`로 바꾸고 이 파일을 커밋하면 `DEPLOY-VERCEL-SUPABASE-CHECK` Task가
완료된 것으로 간주한다.
