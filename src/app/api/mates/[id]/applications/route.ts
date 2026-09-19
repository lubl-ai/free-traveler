import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient, sanitizePlainText } from '@/lib/db/client';

/**
 * Mate post participation requests
 * REQ-FUNC-034,035,036,043
 *
 * GET   /api/mates/[id]/applications        — list requests for a post (RLS: applicant or post author)
 * POST  /api/mates/[id]/applications        — submit a request (status=PENDING, max 500 chars)
 * PATCH /api/mates/[id]/applications        — approve/reject (post author only, body.application_id + status)
 *
 * Duplicate active (PENDING/ACCEPTED) requests are blocked by a DB partial
 * unique index (0001_schema.sql), surfaced here as 409.
 * Approval/rejection results are relayed through the in-app Toast component
 * on the client — no email is sent (docs/ARCHITECTURE.md §15).
 */

interface RouteContext {
  params: Promise<{ id: string }>;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * The only legal state transition: PENDING → ACCEPTED or PENDING →
 * REJECTED. Once an application has left PENDING it's terminal — an
 * author can't flip an already-ACCEPTED request to REJECTED (or back),
 * and PENDING is never a valid target (nothing un-submits a request this
 * way). Exported so UNIT-MATE-STATE can test it directly.
 */
export function isValidApplicationTransition(from: ApplicationStatus, to: 'ACCEPTED' | 'REJECTED'): boolean {
  return from === 'PENDING' && (to === 'ACCEPTED' || to === 'REJECTED');
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id: matePostId } = await params;
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RLS scopes this to the caller's own applications, or all applications
  // on posts the caller authored.
  const { data, error } = await supabase
    .from('mate_application')
    .select('*')
    .eq('mate_post_id', matePostId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }

  return NextResponse.json({ applications: data }, { status: 200 });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id: matePostId } = await params;
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

  const message = body.message;
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: '`message` is required' }, { status: 400 });
  }
  if (message.length > 500) {
    return NextResponse.json({ error: 'message must be 500 characters or fewer' }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from('mate_application')
    .insert({
      mate_post_id: matePostId,
      applicant_id: user.id,
      message: sanitizePlainText(message, 500),
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'You already have a pending or accepted request for this post' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id: matePostId } = await params;
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

  const applicationId = body.application_id;
  const status = body.status;

  if (typeof applicationId !== 'string' || !applicationId) {
    return NextResponse.json({ error: '`application_id` is required' }, { status: 400 });
  }
  if (status !== 'ACCEPTED' && status !== 'REJECTED') {
    return NextResponse.json({ error: 'status must be ACCEPTED or REJECTED' }, { status: 400 });
  }

  // Explicit author check so a non-author gets a clean 403 instead of a
  // silent RLS-filtered no-op (RLS also enforces this at the DB level).
  const { data: post } = await supabase.from('mate_post').select('author_id').eq('id', matePostId).single();
  if (!post) {
    return NextResponse.json({ error: 'Mate post not found' }, { status: 404 });
  }
  if (post.author_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden — only the post author can approve or reject requests' }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from('mate_application')
    .select('status')
    .eq('id', applicationId)
    .eq('mate_post_id', matePostId)
    .single();
  if (!existing) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }
  if (!isValidApplicationTransition(existing.status as ApplicationStatus, status)) {
    return NextResponse.json(
      { error: `Cannot change status from ${existing.status} to ${status}` },
      { status: 409 }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from('mate_application')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .eq('mate_post_id', matePostId)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }

  return NextResponse.json(updated, { status: 200 });
}
