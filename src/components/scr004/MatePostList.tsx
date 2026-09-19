'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MateFilters } from '@/components/scr004/MateFilterBar';

/**
 * Mate Post List
 * REQ-FUNC-030,033,037
 *
 * Fetches from GET /api/mates (API-MATE-POSTS), which already computes
 * CLOSED for past-end_date posts on read (no batch job) and already
 * excludes mutual-block authors server-side (see the block-filtering fix
 * added to that route in W16). This component applies the CMP-SCR004-FILTER
 * criteria client-side against the fetched list — the API only supports a
 * `country` query param — and shows at most 8 posts.
 *
 * The API response never includes applicant/contact fields (only mate_post
 * columns), so "응답에 연락처 미포함" holds by construction, not by any
 * extra filtering here.
 */

const MAX_VISIBLE_POSTS = 8;

interface MatePost {
  id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  max_participants: number;
  style: string | null;
  conditions: string | null;
  status: 'OPEN' | 'CLOSED';
}

function matchesFilters(post: MatePost, filters?: MateFilters): boolean {
  if (!filters) return true;
  if (filters.country && post.country !== filters.country) return false;
  if (filters.region && post.region !== filters.region) return false;
  if (filters.dateFrom && post.start_date < filters.dateFrom) return false;
  if (filters.dateTo && post.end_date > filters.dateTo) return false;
  if (filters.status && post.status !== filters.status) return false;
  if (filters.keyword) {
    const haystack = `${post.conditions ?? ''} ${post.style ?? ''} ${post.title}`.toLowerCase();
    if (!haystack.includes(filters.keyword.toLowerCase())) return false;
  }
  return true;
}

function formatDateRange(start: string, end: string): string {
  const formatter = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

export interface MatePostListProps {
  filters?: MateFilters;
  onResetFilters?: () => void;
  onSelectPost?: (postId: string) => void;
  /** Called whenever the filtered result count changes, so a parent section header can show "총 N건". */
  onResultCount?: (count: number) => void;
}

export function MatePostList({ filters, onResetFilters, onSelectPost, onResultCount }: MatePostListProps) {
  const [posts, setPosts] = useState<MatePost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/mates')
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data: { posts: MatePost[] }) => {
        if (!cancelled) {
          setPosts(data.posts);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('동행글을 불러오지 못했습니다.');
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filtered = posts ? posts.filter((post) => matchesFilters(post, filters)) : [];

  useEffect(() => {
    if (posts !== null) {
      onResultCount?.(filtered.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, posts]);

  if (error) {
    return (
      <div className="flex items-center gap-sm">
        <p className="text-body-sm font-medium text-danger">{error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((n) => n + 1)}
          className="text-body-sm font-medium text-coral hover:text-coral-active"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (posts === null) {
    return (
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-md bg-surface-soft" />
        ))}
      </div>
    );
  }

  const visible = filtered.slice(0, MAX_VISIBLE_POSTS);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md rounded-md border border-hairline px-lg py-xl text-center">
        <div>
          <p className="text-title-sm text-ink mb-xs">조건에 맞는 동행글이 없어요</p>
          <p className="text-body-sm text-body">
            free_traveler에서는 같은 일정의 여행자와 동행 글로 만날 수 있어요. 국가·기간·조건을 적어 글을 올리면
            다른 여행자가 참가 요청을 보낼 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-sm">
          {onResetFilters ? (
            <button type="button" onClick={onResetFilters} className="btn-secondary">
              필터 전체 초기화
            </button>
          ) : null}
          <Link href="/travel-tools?tab=mate" className="btn-primary">
            동행글 작성하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
      {visible.map((post) => (
        <button
          key={post.id}
          type="button"
          onClick={() => onSelectPost?.(post.id)}
          className="rounded-md border border-hairline p-md text-left transition-colors hover:bg-surface-soft"
        >
          <div className="mb-xxs flex items-center justify-between">
            <p className="text-caption text-muted">
              {post.country}
              {post.region ? ` · ${post.region}` : ''}
            </p>
            <span
              className={`text-caption font-medium ${post.status === 'OPEN' ? 'text-success' : 'text-muted-soft'}`}
            >
              {post.status === 'OPEN' ? '모집중' : '마감'}
            </span>
          </div>
          <h3 className="text-title-sm text-ink mb-xs">{post.title}</h3>
          <p className="text-body-sm text-body mb-sm">{formatDateRange(post.start_date, post.end_date)}</p>
          <div className="flex items-center justify-between text-caption text-muted">
            <span>최대 {post.max_participants}명</span>
            {post.style ? <span>{post.style}</span> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
