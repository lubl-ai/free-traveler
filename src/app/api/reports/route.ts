import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient, sanitizePlainText } from '@/lib/db/client';

/**
 * Report submission + admin status handling
 * REQ-FUNC-039,041,042; REQ-NF-019
 *
 * GET   /api/reports        — list reports visible to caller (own, or all if admin — via RLS)
 * POST  /api/reports        — submit a report (fast path, no heavy processing so the
 *                              3-second response requirement is met by default)
 * PATCH /api/reports        — change status (OPEN/RESOLVED/DISMISSED), admin-only
 *
 * RLS already restricts reporter/reported detail visibility to the reporter
 * themselves or an admin (DB-RLS-BASE); this route adds an explicit
 * server-side role check on the admin-only status-change path too.
 */

const VALID_STATUSES = ['OPEN', 'RESOLVED', 'DISMISSED'] as const;

export async function GET() {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RLS scopes this to the caller's own reports, or all reports if admin.
  const { data, error } = await supabase.from('report').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 });
  }

  return NextResponse.json({ reports: data }, { status: 200 });
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

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const reasonCode = body.reason_code;
  if (typeof reasonCode !== 'string' || !reasonCode) {
    return NextResponse.json({ error: '`reason_code` is required' }, { status: 400 });
  }

  const reportedUserId = typeof body.reported_user_id === 'string' ? body.reported_user_id : null;
  const reportedMatePostId = typeof body.reported_mate_post_id === 'string' ? body.reported_mate_post_id : null;

  if (!reportedUserId && !reportedMatePostId) {
    return NextResponse.json(
      { error: 'At least one of `reported_user_id` or `reported_mate_post_id` is required' },
      { status: 400 }
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from('report')
    .insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      reported_mate_post_id: reportedMatePostId,
      reason_code: sanitizePlainText(reasonCode, 100),
      description: body.description ? sanitizePlainText(String(body.description), 1000) : null,
    })
    .select('id, status, created_at')
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }

  return NextResponse.json(
    { report_id: inserted.id, status: inserted.status, submitted_at: inserted.created_at },
    { status: 201 }
  );
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

  const { data: profile } = await supabase.from('user_profile').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin role required' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = body.id;
  const status = body.status;

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: '`id` is required' }, { status: 400 });
  }
  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from('report')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }

  return NextResponse.json(updated, { status: 200 });
}
