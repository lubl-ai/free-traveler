import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient } from '@/lib/db/client';

/**
 * Admin outbound URL settings (flight/hotel)
 * REQ-FUNC-077 — Admin-only, HTTPS allowlist for external outbound URLs
 *
 * Stores APP_SETTING rows keyed by FLIGHT_OUTBOUND_URL / HOTEL_OUTBOUND_URL.
 * Rejects non-HTTPS schemes outright (http:, javascript:, data:, etc.) before
 * ever touching the database — RLS on app_setting additionally restricts the
 * write itself to the admin role (DB-RLS-BASE), so this is defense in depth,
 * not the sole guard.
 */

const ALLOWED_SETTING_KEYS = ['FLIGHT_OUTBOUND_URL', 'HOTEL_OUTBOUND_URL'] as const;
type SettingKey = (typeof ALLOWED_SETTING_KEYS)[number];

function isAllowedKey(key: string): key is SettingKey {
  return (ALLOWED_SETTING_KEYS as readonly string[]).includes(key);
}

function isHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profile')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin role required' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('key' in body) ||
    !('value' in body) ||
    typeof (body as Record<string, unknown>).key !== 'string' ||
    typeof (body as Record<string, unknown>).value !== 'string'
  ) {
    return NextResponse.json({ error: '`key` and `value` string fields are required' }, { status: 400 });
  }

  const { key, value } = body as { key: string; value: string };

  if (!isAllowedKey(key)) {
    return NextResponse.json(
      { error: `Unsupported key. Allowed keys: ${ALLOWED_SETTING_KEYS.join(', ')}` },
      { status: 400 }
    );
  }

  if (!isHttpsUrl(value)) {
    return NextResponse.json(
      { error: 'value must be an https:// URL. http:, javascript:, data: and other schemes are rejected.' },
      { status: 400 }
    );
  }

  const { error: upsertError } = await supabase
    .from('app_setting')
    .upsert({ key, value, updated_by: user.id, updated_at: new Date().toISOString() });

  if (upsertError) {
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }

  return NextResponse.json({ key, value }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const supabase = await createServerDbClient();
  const key = request.nextUrl.searchParams.get('key');

  if (!key || !isAllowedKey(key)) {
    return NextResponse.json(
      { error: `\`key\` query param is required and must be one of: ${ALLOWED_SETTING_KEYS.join(', ')}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from('app_setting').select('key, value, updated_at').eq('key', key).single();

  if (error || !data) {
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}
