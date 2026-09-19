'use client';

import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';
import { BlockAction } from '@/components/scr004/BlockAction';
import { ReportDialog } from '@/components/scr004/ReportDialog';

/**
 * Mate Post Detail Panel
 * REQ-FUNC-033,037,039,040
 *
 * Desktop: renders in-flow as a static panel (the Page Owner places it
 * beside MatePostList in a 40/60 split). Mobile: renders as a fixed bottom
 * Drawer with a scrim, matching the DestinationDrawer/SafetyDrawer pattern
 * from SCR-001.
 *
 * Author info shows only nickname + adult-verification badge — never
 * contact info (mate_post/user_profile have no contact columns at all) and
 * no age-range field (none exists in the schema; fabricating one was
 * avoided, same resolution as MateFilterBar's 연령대 filter gap).
 * The author's profile is fetched via the browser Supabase client using the
 * new public-read policy (0003_user_profile_public_read.sql) — a necessary
 * correction found while building this component, since the original W05
 * RLS only allowed reading your own row.
 */

interface MatePostDetail {
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
}

interface AuthorProfile {
  nickname: string;
  is_adult: boolean;
}

export interface MateDetailPanelProps {
  postId: string | null;
  onClose: () => void;
  onRequestApply?: (postId: string) => void;
}

export function MateDetailPanel({ postId, onClose, onRequestApply }: MateDetailPanelProps) {
  useEffect(() => {
    if (!postId) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [postId, onClose]);

  if (!postId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:static md:z-auto md:block md:h-full">
      <div className="absolute inset-0 bg-[var(--shadow-scrim)] md:hidden" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="동행글 상세"
        className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-lg bg-canvas shadow-floating md:h-full md:max-h-none md:rounded-md md:border md:border-hairline md:shadow-none"
      >
        {/* Keyed by postId so switching posts resets fetch state via remount, not an effect */}
        <MateDetailContent key={postId} postId={postId} onClose={onClose} onRequestApply={onRequestApply} />
      </div>
    </div>
  );
}

function MateDetailContent({
  postId,
  onClose,
  onRequestApply,
}: {
  postId: string;
  onClose: () => void;
  onRequestApply?: (postId: string) => void;
}) {
  const [post, setPost] = useState<MatePostDetail | null>(null);
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/mates?id=${encodeURIComponent(postId)}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(async (data: MatePostDetail) => {
        if (cancelled) return;
        setPost(data);

        try {
          const supabase = createBrowserDbClient();
          const { data: profile } = await supabase
            .from('user_profile')
            .select('nickname, is_adult')
            .eq('id', data.author_id)
            .single();
          if (!cancelled) setAuthor(profile ?? null);
        } catch {
          // Author profile is supplementary; the post itself still renders.
        }
      })
      .catch(() => {
        if (!cancelled) setError('동행글을 불러오지 못했습니다.');
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-canvas px-lg py-md">
        <h2 className="text-title-md text-ink">{post ? post.title : '동행글 상세'}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface-soft"
          aria-label="닫기"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="px-lg py-md">
        {error ? <p className="text-body-sm font-medium text-danger">{error}</p> : null}

        {!post && !error ? (
          <div className="flex flex-col gap-sm" aria-hidden="true">
            <div className="h-4 w-1/3 animate-pulse rounded-sm bg-surface-soft" />
            <div className="h-24 animate-pulse rounded-sm bg-surface-soft" />
          </div>
        ) : null}

        {post ? (
          <div className="flex flex-col gap-lg">
            <div>
              <p className="text-caption text-muted mb-xxs">
                {post.country}
                {post.region ? ` · ${post.region}` : ''}
              </p>
              <p className="text-body-sm text-body">
                {post.start_date} ~ {post.end_date} · 최대 {post.max_participants}명
              </p>
            </div>

            <div className="flex items-center gap-sm rounded-sm bg-surface-soft px-md py-sm">
              <span className="text-body-sm font-medium text-ink">{author?.nickname ?? '알 수 없는 사용자'}</span>
              {author?.is_adult ? (
                <span className="rounded-full bg-info/10 px-sm py-xxs text-caption font-medium text-info">
                  성인 인증 완료
                </span>
              ) : null}
            </div>

            {post.conditions ? (
              <section>
                <h3 className="text-title-sm text-ink mb-xs">동행 조건</h3>
                <p className="text-body-sm text-body">{post.conditions}</p>
              </section>
            ) : null}

            {post.style ? (
              <section>
                <h3 className="text-title-sm text-ink mb-xs">여행 스타일</h3>
                <p className="text-body-sm text-body">{post.style}</p>
              </section>
            ) : null}

            <section>
              <h3 className="text-title-sm text-ink mb-xs">상세 설명</h3>
              <p className="text-body-sm text-body whitespace-pre-wrap">{post.description}</p>
            </section>

            <div className="flex flex-wrap items-center gap-sm border-t border-hairline pt-md">
              <button
                type="button"
                onClick={() => onRequestApply?.(post.id)}
                disabled={post.status !== 'OPEN'}
                className="btn-primary"
              >
                {post.status === 'OPEN' ? '참가 요청 보내기' : '모집 마감'}
              </button>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="text-body-sm font-medium text-muted hover:text-danger"
              >
                신고
              </button>
              <BlockAction targetUserId={post.author_id} />
            </div>
          </div>
        ) : null}
      </div>

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={post?.author_id}
        reportedMatePostId={post?.id}
      />
    </>
  );
}
