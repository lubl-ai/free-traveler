'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';
import { destinations } from '@/data/destinations';
import { getFavorites, removeFavorite } from '@/lib/favorites';

/**
 * My Posts / Participation Requests / Blocked Users / Favorites
 * REQ-FUNC-036,038,040,068
 *
 * "보낸/받은" participation requests need to read across every one of the
 * caller's own mate_post rows plus every request they personally submitted
 * — no single existing API route covers that aggregate view, so this reads
 * mate_post/mate_application directly via the browser client. RLS already
 * scopes mate_application to `applicant_id = auth.uid() OR mate_post_id in
 * (posts I authored)` (0002_rls.sql), so this is exactly as safe as going
 * through an API route would be. Approve/reject itself still goes through
 * PATCH /api/mates/[id]/applications (API-MATE-APPLICATIONS), which already
 * enforces "author only" server-side — 403 for anyone else.
 */

type Section = 'posts' | 'requests' | 'blocks' | 'favorites';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'posts', label: '내 글' },
  { id: 'requests', label: '참가 요청' },
  { id: 'blocks', label: '차단 목록' },
  { id: 'favorites', label: '즐겨찾기' },
];

export function MyActivityTab() {
  const [activeSection, setActiveSection] = useState<Section>('posts');
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => createBrowserDbClient().auth.getUser())
      .then(({ data }) => {
        if (!cancelled) setUserId(data.user?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setUserId(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (userId === undefined) {
    return <div className="h-64 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (userId === null) {
    return <p className="text-body-sm text-body">로그인이 필요합니다.</p>;
  }

  return (
    <div className="flex flex-col gap-md">
      <div role="tablist" className="flex flex-wrap gap-xs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeSection === s.id}
            onClick={() => setActiveSection(s.id)}
            className={`tab-pill${activeSection === s.id ? ' active' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'posts' ? <MyPostsSection userId={userId} /> : null}
      {activeSection === 'requests' ? <RequestsSection userId={userId} /> : null}
      {activeSection === 'blocks' ? <BlocksSection /> : null}
      {activeSection === 'favorites' ? <FavoritesSection /> : null}
    </div>
  );
}

interface MatePostRow {
  id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'CLOSED';
}

function MyPostsSection({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<MatePostRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() =>
        createBrowserDbClient()
          .from('mate_post')
          .select('id, title, country, region, start_date, end_date, status')
          .eq('author_id', userId)
          .order('created_at', { ascending: false })
      )
      .then(({ data }) => {
        if (!cancelled) setPosts(data ?? []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function closePost(id: string) {
    const response = await fetch('/api/mates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'CLOSED' }),
    });
    if (response.ok && posts) {
      setPosts(posts.map((p) => (p.id === id ? { ...p, status: 'CLOSED' } : p)));
    }
  }

  async function deletePost(id: string) {
    const response = await fetch(`/api/mates?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok && posts) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  }

  if (posts === null) {
    return (
      <div className="flex flex-col gap-sm" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-surface-soft" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md rounded-md border border-hairline px-lg py-xl text-center">
        <p className="text-body-sm text-body">아직 작성한 동행글이 없어요.</p>
        <Link href="/travel-tools?tab=mate" className="btn-primary">
          동행글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {posts.map((post) => (
        <div key={post.id} className="rounded-md border border-hairline p-md">
          <div className="mb-xs flex items-center justify-between">
            <p className="text-title-sm text-ink">{post.title}</p>
            <span className={`text-caption font-medium ${post.status === 'OPEN' ? 'text-success' : 'text-muted-soft'}`}>
              {post.status === 'OPEN' ? '모집중' : '마감'}
            </span>
          </div>
          <p className="mb-sm text-body-sm text-body">
            {post.country}
            {post.region ? ` · ${post.region}` : ''} · {post.start_date} ~ {post.end_date}
          </p>
          <div className="flex gap-sm">
            {post.status === 'OPEN' ? (
              <button type="button" onClick={() => closePost(post.id)} className="text-body-sm font-medium text-coral hover:text-coral-active">
                마감하기
              </button>
            ) : null}
            <button type="button" onClick={() => deletePost(post.id)} className="text-body-sm font-medium text-danger hover:opacity-80">
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ApplicationRow {
  id: string;
  mate_post_id: string;
  applicant_id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

function RequestsSection({ userId }: { userId: string }) {
  const [sent, setSent] = useState<ApplicationRow[] | null>(null);
  const [received, setReceived] = useState<ApplicationRow[] | null>(null);
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let supabase: ReturnType<typeof createBrowserDbClient>;
      try {
        supabase = createBrowserDbClient();
      } catch {
        if (!cancelled) {
          setSent([]);
          setReceived([]);
        }
        return;
      }

      const { data: myPosts } = await supabase.from('mate_post').select('id, title').eq('author_id', userId);
      const myPostIds = (myPosts ?? []).map((p) => p.id);
      if (!cancelled) {
        setPostTitles(Object.fromEntries((myPosts ?? []).map((p) => [p.id, p.title])));
      }

      const { data: sentData } = await supabase
        .from('mate_application')
        .select('id, mate_post_id, applicant_id, message, status')
        .eq('applicant_id', userId);
      if (!cancelled) setSent(sentData ?? []);

      if (myPostIds.length > 0) {
        const { data: receivedData } = await supabase
          .from('mate_application')
          .select('id, mate_post_id, applicant_id, message, status')
          .in('mate_post_id', myPostIds);
        if (!cancelled) setReceived((receivedData ?? []).filter((r) => r.applicant_id !== userId));
      } else if (!cancelled) {
        setReceived([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function respond(applicationId: string, matePostId: string, status: 'ACCEPTED' | 'REJECTED') {
    const response = await fetch(`/api/mates/${encodeURIComponent(matePostId)}/applications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId, status }),
    });
    if (response.ok && received) {
      setReceived(received.map((r) => (r.id === applicationId ? { ...r, status } : r)));
    }
  }

  if (sent === null || received === null) {
    return (
      <div className="flex flex-col gap-sm" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-md bg-surface-soft" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h3 className="text-title-sm text-ink mb-sm">받은 요청</h3>
        {received.length === 0 ? (
          <p className="text-body-sm text-muted">아직 받은 참가 요청이 없어요.</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {received.map((req) => (
              <div key={req.id} className="rounded-md border border-hairline p-md">
                <p className="mb-xs text-body-sm text-muted">{postTitles[req.mate_post_id] ?? '동행글'}</p>
                <p className="mb-sm text-body-sm text-body">{req.message}</p>
                {req.status === 'PENDING' ? (
                  <div className="flex gap-sm">
                    <button
                      type="button"
                      onClick={() => respond(req.id, req.mate_post_id, 'ACCEPTED')}
                      className="text-body-sm font-medium text-success hover:opacity-80"
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      onClick={() => respond(req.id, req.mate_post_id, 'REJECTED')}
                      className="text-body-sm font-medium text-danger hover:opacity-80"
                    >
                      거절
                    </button>
                  </div>
                ) : (
                  <span className="text-caption text-muted-soft">{req.status}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-title-sm text-ink mb-sm">보낸 요청</h3>
        {sent.length === 0 ? (
          <p className="text-body-sm text-muted">아직 보낸 참가 요청이 없어요.</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {sent.map((req) => (
              <div key={req.id} className="rounded-md border border-hairline p-md">
                <p className="mb-xs text-body-sm text-body">{req.message}</p>
                <span className="text-caption text-muted-soft">{req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlocksSection() {
  const [blocks, setBlocks] = useState<{ id: string; blocked_id: string; nickname: string }[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/blocks');
        if (!response.ok) {
          if (!cancelled) setBlocks([]);
          return;
        }
        const data = (await response.json()) as { blocks: { id: string; blocked_id: string }[] };
        const supabase = createBrowserDbClient();
        const withNicknames = await Promise.all(
          data.blocks.map(async (b) => {
            const { data: profile } = await supabase.from('user_profile').select('nickname').eq('id', b.blocked_id).single();
            return { ...b, nickname: profile?.nickname ?? '알 수 없는 사용자' };
          })
        );
        if (!cancelled) setBlocks(withNicknames);
      } catch {
        if (!cancelled) setBlocks([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function unblock(blockedId: string) {
    const response = await fetch(`/api/blocks?blocked_id=${encodeURIComponent(blockedId)}`, { method: 'DELETE' });
    if (response.ok && blocks) {
      setBlocks(blocks.filter((b) => b.blocked_id !== blockedId));
    }
  }

  if (blocks === null) {
    return <div className="h-20 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (blocks.length === 0) {
    return (
      <div className="rounded-md border border-hairline px-lg py-xl text-center">
        <p className="text-body-sm text-body">차단한 사용자가 없어요.</p>
        <p className="text-caption text-muted mt-xs">불편한 사용자를 차단하면 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {blocks.map((b) => (
        <div key={b.id} className="flex items-center justify-between rounded-md border border-hairline p-md">
          <span className="text-body-sm text-ink">{b.nickname}</span>
          <button type="button" onClick={() => unblock(b.blocked_id)} className="text-body-sm font-medium text-coral hover:text-coral-active">
            차단 해제
          </button>
        </div>
      ))}
    </div>
  );
}

function FavoritesSection() {
  // Lazy initializer (not an effect): localStorage is only readable client-side,
  // and this whole tab already only renders after the auth check resolves
  // client-side, so there's no SSR markup to mismatch against here.
  const [favoriteIds, setFavoriteIds] = useState<string[] | null>(() => getFavorites());

  if (favoriteIds === null) {
    return <div className="h-20 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  const favoriteDestinations = favoriteIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  if (favoriteDestinations.length === 0) {
    return (
      <div className="rounded-md border border-hairline px-lg py-xl text-center">
        <p className="text-body-sm text-body">즐겨찾기한 여행지가 없어요.</p>
        <Link href="/" className="mt-sm inline-block text-body-sm font-medium text-coral hover:text-coral-active">
          여행지 둘러보기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
      {favoriteDestinations.map((destination) => (
        <div key={destination.id} className="rounded-md border border-hairline p-md">
          <p className="text-caption text-muted mb-xxs">{destination.country}</p>
          <p className="text-title-sm text-ink mb-sm">{destination.nameKo}</p>
          <button
            type="button"
            onClick={() => setFavoriteIds(removeFavorite(destination.id))}
            className="text-body-sm font-medium text-coral hover:text-coral-active"
          >
            즐겨찾기 해제
          </button>
        </div>
      ))}
    </div>
  );
}
