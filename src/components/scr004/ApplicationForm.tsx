'use client';

import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';

/**
 * Mate Post Participation Request Form
 * REQ-FUNC-034,035,036
 *
 * Submits to POST /api/mates/[id]/applications (API-MATE-APPLICATIONS),
 * which stores status=PENDING and enforces the duplicate-active-request
 * unique constraint server-side (0001_schema.sql's partial unique index) —
 * this form surfaces that as a specific "already applied" message rather
 * than a generic error. Approve/reject-by-author-only is already enforced
 * by that same API's PATCH handler; this component only submits.
 */

const MAX_MESSAGE_LENGTH = 500;

type AuthState = { status: 'loading' } | { status: 'unauthenticated' } | { status: 'authenticated' };

function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = createBrowserDbClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) setState({ status: 'unauthenticated' });
          return;
        }

        const { data: profile } = await supabase.from('user_profile').select('is_adult').eq('id', user.id).single();

        if (!cancelled) {
          setState(profile?.is_adult ? { status: 'authenticated' } : { status: 'unauthenticated' });
        }
      } catch {
        if (!cancelled) setState({ status: 'unauthenticated' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export interface ApplicationFormProps {
  matePostId: string;
  onSubmitted?: () => void;
}

export function ApplicationForm({ matePostId, onSubmitted }: ApplicationFormProps) {
  const authState = useAuthState();

  if (authState.status === 'loading') {
    return <div className="h-24 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (authState.status === 'unauthenticated') {
    return (
      <div className="rounded-md bg-info/10 px-md py-md text-body-sm text-ink">
        참가 요청은 로그인 후 성인 확인을 완료한 회원만 보낼 수 있습니다.
      </div>
    );
  }

  return <ApplicationFormAuthenticated matePostId={matePostId} onSubmitted={onSubmitted} />;
}

function ApplicationFormAuthenticated({ matePostId, onSubmitted }: ApplicationFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/mates/${encodeURIComponent(matePostId)}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError('이미 이 동행글에 참가 요청을 보냈습니다.');
        } else {
          setError('참가 요청 전송에 실패했습니다. 다시 시도해주세요.');
        }
        return;
      }

      setIsSubmitted(true);
      onSubmitted?.();
    } catch {
      setError('참가 요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-md bg-success/10 px-md py-md text-body-sm text-ink">
        참가 요청을 보냈습니다. 작성자가 승인하면 알림을 받을 수 있습니다.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
      <label className="flex flex-col gap-xs">
        <span className="text-body-sm font-medium text-ink">참가 요청 메시지</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          required
          rows={4}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="간단한 자기소개와 함께 참가 요청 메시지를 남겨주세요."
          className="rounded-sm border border-border-strong bg-canvas px-md py-sm text-body-md text-ink"
        />
        <span className="self-end text-caption text-muted-soft">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </label>

      {error ? <p className="text-body-sm font-medium text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={!message.trim() || isSubmitting}
        className="btn-primary inline-flex h-11 items-center justify-center self-start"
      >
        참가 요청 보내기
      </button>
    </form>
  );
}
