import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient } from '@/lib/db/client';
import { ensureUserProfile } from '@/lib/auth';

/**
 * Supabase Auth email-confirmation callback
 * REQ-FUNC-027,028,066 — technical route, not a Screen/Page Entry
 *
 * Exchanges the auth code Supabase sends back after email verification
 * (signup confirmation, magic link, password reset) for a session, then
 * ensures a matching `user_profile` row exists before redirecting.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  if (!code) {
    return NextResponse.redirect(`${origin}/account?error=missing_code`);
  }

  const supabase = await createServerDbClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    return NextResponse.redirect(`${origin}/account?error=auth_failed`);
  }

  const fallbackNickname = data.user.email?.split('@')[0] ?? 'traveler';
  await ensureUserProfile(supabase, data.user.id, fallbackNickname);

  const redirectPath = next.startsWith('/') ? next : '/account';
  return NextResponse.redirect(`${origin}${redirectPath}`);
}
