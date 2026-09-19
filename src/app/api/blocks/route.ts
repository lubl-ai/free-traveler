import { NextRequest, NextResponse } from 'next/server';
import { createServerDbClient } from '@/lib/db/client';

/**
 * User block relationships
 * REQ-FUNC-040
 *
 * GET    /api/blocks              — list the caller's own blocks (RLS: blocker_id = auth.uid())
 * POST   /api/blocks              — create a block (blocker = current session user)
 * DELETE /api/blocks?blocked_id=  — remove a block
 *
 * (blocker_id, blocked_id) uniqueness is enforced by a DB unique constraint
 * (0001_schema.sql); this route surfaces that as a 409 rather than a 500.
 */

export async function GET() {
  const supabase = await createServerDbClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_block')
    .select('id, blocked_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load blocks' }, { status: 500 });
  }

  return NextResponse.json({ blocks: data }, { status: 200 });
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

  const blockedId = body.blocked_id;
  if (typeof blockedId !== 'string' || !blockedId) {
    return NextResponse.json({ error: '`blocked_id` is required' }, { status: 400 });
  }

  if (blockedId === user.id) {
    return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from('user_block')
    .insert({ blocker_id: user.id, blocked_id: blockedId })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'This user is already blocked' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
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

  const blockedId = request.nextUrl.searchParams.get('blocked_id');
  if (!blockedId) {
    return NextResponse.json({ error: '`blocked_id` query param is required' }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from('user_block')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId);

  if (deleteError) {
    return NextResponse.json({ error: 'Failed to remove block' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
