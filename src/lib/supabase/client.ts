'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client factory
 * docs/ARCHITECTURE.md §8 — "Browser Client | Client Component 내부"
 *
 * Only for session/Auth state (login check, adult-verification status) from
 * Client Components. Uses only NEXT_PUBLIC_ env vars — never a service-role
 * or other server-only key (CLAUDE.md 규칙 15). RLS applies to every query
 * made through this client exactly as it does server-side.
 */
export function createBrowserDbClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
