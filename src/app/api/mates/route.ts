import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient, sanitizePlainText } from '@/lib/db/client';

/**
 * Mate post CRUD
 * REQ-FUNC-031,037,038
 *
 * GET    /api/mates          — list (or ?id= for a single post)
 * POST   /api/mates          — create (author = current session user)
 * PATCH  /api/mates          — update/close (body.id, author-only via RLS)
 * DELETE /api/mates?id=      — delete (author-only via RLS)
 *
 * `status` is never trusted from stale storage on read: a post whose
 * end_date has passed is reported as CLOSED in the API response even if the
 * stored row still says OPEN, with no batch/cron job recomputing it.
 */

/**
 * Server-side mirror of MateWriteForm's `detectContactInfo` (CMP-SCR003-MATE-WRITE).
 * Kept as a small standalone duplicate rather than importing the client
 * component's module into a Route Handler.
 */
function containsContactInfo(text: string): boolean {
  const patterns = [
    /\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /카카오\s?톡|카톡\s?(아이디|id)?|라인\s?(아이디|id)|텔레그램|인스타(그램)?\s?(dm|디엠)?/i,
    /\b\d{7,}\b/,
  ];
  return patterns.some((pattern) => pattern.test(text));
}

interface MatePostRow {
  id: string;
  author_id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  max_participants: number;
  conditions: string | null;
  style: string | null;
  description: string;
  status: 'OPEN' | 'CLOSED';
  safety_policy_version: string;
  safety_agreed_at: string;
  created_at: string;
  updated_at: string;
}

export function withComputedStatus<T extends { end_date: string; status: string }>(row: T): T {
  const isPastEndDate = new Date(row.end_date) < new Date(new Date().toISOString().slice(0, 10));
  return isPastEndDate ? { ...row, status: 'CLOSED' } : row;
}

/**
 * Ids of users involved in a block relationship with the caller in either
 * direction (blocked by the caller, or the caller was blocked by them).
 * REQ-FUNC-040 / CMP-SCR004-BLOCK, CMP-SCR004-FILTER — "상호 글 비노출".
 * Returns an empty set for anonymous visitors (nothing to exclude).
 */
async function getMutualBlockedUserIds(supabase: Awaited<ReturnType<typeof createServerDbClient>>): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Set();
  }

  const { data } = await supabase.from('user_block').select('blocker_id, blocked_id').or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

  const ids = new Set<string>();
  for (const row of data ?? []) {
    if (row.blocker_id === user.id) ids.add(row.blocked_id);
    if (row.blocked_id === user.id) ids.add(row.blocker_id);
  }
  return ids;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerDbClient();
  const id = request.nextUrl.searchParams.get('id');
  const country = request.nextUrl.searchParams.get('country');
  const blockedUserIds = await getMutualBlockedUserIds(supabase);

  if (id) {
    const { data, error } = await supabase.from('mate_post').select('*').eq('id', id).single();
    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (blockedUserIds.has((data as MatePostRow).author_id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(withComputedStatus(data as MatePostRow), { status: 200 });
  }

  let query = supabase.from('mate_post').select('*').order('created_at', { ascending: false });
  if (country) {
    query = query.eq('country', country);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: 'Failed to load mate posts' }, { status: 500 });
  }

  const visiblePosts = (data as MatePostRow[]).filter((row) => !blockedUserIds.has(row.author_id));
  const posts = visiblePosts.map(withComputedStatus);
  return NextResponse.json({ posts }, { status: 200 });
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

  const { data: profile } = await supabase.from('user_profile').select('is_adult').eq('id', user.id).single();
  if (!profile?.is_adult) {
    return NextResponse.json({ error: 'Adult verification required' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const required = ['title', 'country', 'start_date', 'end_date', 'max_participants', 'description', 'safety_policy_version'];
  const missing = required.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  }

  // Server-side half of the "client+server dual verification" contact-info
  // check required by CMP-SCR003-MATE-WRITE — the client-side regex check
  // alone can always be bypassed by calling this endpoint directly.
  const contactCheckText = [body.title, body.conditions, body.style, body.description]
    .filter((v): v is string => typeof v === 'string')
    .join(' ');
  if (containsContactInfo(contactCheckText)) {
    return NextResponse.json({ error: 'contact_info_detected: description contains contact information' }, { status: 400 });
  }

  const { error: insertError, data: inserted } = await supabase
    .from('mate_post')
    .insert({
      author_id: user.id,
      title: sanitizePlainText(String(body.title), 100),
      country: sanitizePlainText(String(body.country), 100),
      region: body.region ? sanitizePlainText(String(body.region), 100) : null,
      start_date: body.start_date,
      end_date: body.end_date,
      max_participants: body.max_participants,
      conditions: body.conditions ? sanitizePlainText(String(body.conditions), 500) : null,
      style: body.style ? sanitizePlainText(String(body.style), 500) : null,
      description: sanitizePlainText(String(body.description), 3000),
      safety_policy_version: String(body.safety_policy_version),
      safety_agreed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: 'Failed to create mate post' }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = body.id;
  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: '`id` is required' }, { status: 400 });
  }

  const updatable: Record<string, unknown> = {};
  const allowedFields = ['title', 'country', 'region', 'start_date', 'end_date', 'max_participants', 'conditions', 'style', 'description', 'status'];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updatable[field] = typeof body[field] === 'string' ? sanitizePlainText(body[field] as string, 3000) : body[field];
    }
  }

  if (updatable.status !== undefined && updatable.status !== 'OPEN' && updatable.status !== 'CLOSED') {
    return NextResponse.json({ error: 'status must be OPEN or CLOSED' }, { status: 400 });
  }

  // RLS restricts the actual write to the post author; this pre-check gives
  // a clean 403 instead of a silent no-op update when RLS blocks the row.
  const { data: existing } = await supabase.from('mate_post').select('author_id').eq('id', id).single();
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden — only the author can modify this post' }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabase
    .from('mate_post')
    .update(updatable)
    .eq('id', id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Failed to update mate post' }, { status: 500 });
  }

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: '`id` query param is required' }, { status: 400 });
  }

  const { data: existing } = await supabase.from('mate_post').select('author_id').eq('id', id).single();
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden — only the author can delete this post' }, { status: 403 });
  }

  const { error: deleteError } = await supabase.from('mate_post').delete().eq('id', id);
  if (deleteError) {
    return NextResponse.json({ error: 'Failed to delete mate post' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
