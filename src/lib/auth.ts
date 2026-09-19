import 'server-only';

import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createServerDbClient } from '@/lib/db/client';

/**
 * Auth session verification + adult-verification status helpers
 * REQ-FUNC-027,028,066
 *
 * Session state lives entirely in Supabase Auth's standard cookies (set by
 * createServerDbClient's cookie adapter) — no custom session table.
 * No birthdate is ever stored; only a boolean `is_adult` flag plus the
 * timestamp it was set (REQ-FUNC-028 privacy minimization).
 */

export interface SessionResult {
  user: User;
  isAdult: boolean;
}

/**
 * Verifies the current request has a valid Supabase Auth session.
 * Returns null when there is no session — callers decide how to respond
 * (redirect to /account login tab, 401 JSON, etc.), this helper does not
 * throw or redirect itself so it stays usable from both Route Handlers and
 * Server Components.
 */
export async function getVerifiedSession(): Promise<SessionResult | null> {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase.from('user_profile').select('is_adult').eq('id', user.id).single();

  return { user, isAdult: profile?.is_adult ?? false };
}

/**
 * Records adult-verification status for the given user.
 * Stores only a boolean flag + the verification timestamp — never a
 * birthdate or age (REQ-FUNC-028).
 */
export async function markAdultVerified(supabase: SupabaseClient, userId: string): Promise<void> {
  await supabase
    .from('user_profile')
    .update({ is_adult: true, adult_verified_at: new Date().toISOString() })
    .eq('id', userId);
}

/**
 * Ensures a `user_profile` row exists for a newly-authenticated user.
 * Called from the auth callback right after a session is established.
 */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  userId: string,
  fallbackNickname: string
): Promise<void> {
  const { data: existing } = await supabase.from('user_profile').select('id').eq('id', userId).maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from('user_profile').insert({
    id: userId,
    nickname: fallbackNickname.slice(0, 50) || 'traveler',
    role: 'member',
    is_adult: false,
  });
}
