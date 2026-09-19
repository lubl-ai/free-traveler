'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { destinations } from '@/data/destinations';
import { getPolicy } from '@/data/policies';
import { createBrowserDbClient } from '@/lib/supabase/client';
import { Toast, useToast } from '@/components/shared/Toast';

/**
 * Mate Post Write Form (or login prompt)
 * REQ-FUNC-027,028,029,031,032,080
 *
 * Unauthenticated/adult-unverified visitors see an `info`-toned prompt
 * linking to the /account login tab instead of the form.
 * Contact-info detection runs client-side here (regex, exported for
 * UNIT-CONTACT-DETECTION) AND must be re-run server-side in
 * /api/mates (API-MATE-POSTS) — "이중 검증" per this task's own AC — since
 * client-side checks alone can always be bypassed.
 */

const COUNTRY_REGIONS: Record<string, string[]> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const d of destinations) {
    if (!map[d.country]) {
      map[d.country] = new Set();
    }
    if (d.region) {
      map[d.country].add(d.region);
    }
  }
  return Object.fromEntries(Object.entries(map).map(([country, regions]) => [country, Array.from(regions).sort()]));
})();

const COUNTRIES = Object.keys(COUNTRY_REGIONS).sort();

export function detectContactInfo(text: string): boolean {
  const patterns = [
    /\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/, // phone-like sequences (010-1234-5678 etc.)
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email
    /카카오\s?톡|카톡\s?(아이디|id)?|라인\s?(아이디|id)|텔레그램|인스타(그램)?\s?(dm|디엠)?/i, // messenger mentions
    /\b\d{7,}\b/, // long unbroken digit sequences
  ];
  return patterns.some((pattern) => pattern.test(text));
}

type AuthState = { status: 'loading' } | { status: 'unauthenticated' } | { status: 'authenticated' };

function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Any failure here (including an unconfigured/unreachable Supabase
      // project — a known bootstrap blocker, see docs/ARCHITECTURE.md §14)
      // must resolve to the login prompt, never leave the form stuck on its
      // loading skeleton forever.
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

export function MateWriteForm() {
  const authState = useAuthState();

  if (authState.status === 'loading') {
    return <div className="h-40 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (authState.status === 'unauthenticated') {
    return (
      <div className="rounded-md bg-info/10 px-lg py-xl text-center">
        <p className="text-title-sm text-ink mb-xs">로그인 및 성인 확인이 필요합니다</p>
        <p className="text-body-sm text-body mb-md">
          동행글 작성은 로그인 후 성인 확인을 완료한 회원만 이용할 수 있습니다.
        </p>
        <Link href="/account?tab=login" className="btn-primary">
          로그인하고 성인 인증하기
        </Link>
      </div>
    );
  }

  return <MateWriteFormAuthenticated />;
}

function MateWriteFormAuthenticated() {
  const { messages, showSuccess, dismissToast } = useToast();

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('2');
  const [conditions, setConditions] = useState('');
  const [style, setStyle] = useState('');
  const [description, setDescription] = useState('');
  const [agreedToSafety, setAgreedToSafety] = useState(false);
  const [contactWarning, setContactWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regionOptions = country ? COUNTRY_REGIONS[country] ?? [] : [];
  const safetyPolicy = useMemo(() => getPolicy('safety'), []);

  const canSubmit =
    title && country && region && startDate && endDate && maxParticipants && description && agreedToSafety;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void submitForm();
  }

  async function submitForm() {
    setContactWarning(null);
    setSubmitError(null);

    const combinedText = [title, conditions, style, description].join(' ');
    if (detectContactInfo(combinedText)) {
      setContactWarning('연락처로 추정되는 정보(전화번호, 이메일, 메신저 아이디 등)는 입력할 수 없습니다. 내용을 수정해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/mates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          country,
          region,
          start_date: startDate,
          end_date: endDate,
          max_participants: Number(maxParticipants),
          conditions: conditions || undefined,
          style: style || undefined,
          description,
          safety_policy_version: safetyPolicy?.version ?? '1.0',
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 400 && body.error?.includes('contact')) {
          setContactWarning('연락처로 추정되는 정보는 입력할 수 없습니다. 내용을 수정해주세요.');
        } else {
          setSubmitError('동행글 등록에 실패했습니다. 다시 시도해주세요.');
        }
        return;
      }

      showSuccess('동행글이 등록되었습니다.');
      setTitle('');
      setCountry('');
      setRegion('');
      setStartDate('');
      setEndDate('');
      setMaxParticipants('2');
      setConditions('');
      setStyle('');
      setDescription('');
      setAgreedToSafety(false);
    } catch {
      setSubmitError('동행글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">제목</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
          />
        </label>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">국가</span>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setRegion('');
              }}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            >
              <option value="">국가 선택</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">지역</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              disabled={!country}
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink disabled:bg-surface-soft disabled:text-muted-soft"
            >
              <option value="">지역 선택</option>
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">시작일</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">종료일</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">모집 인원</span>
            <input
              type="number"
              min={1}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">동행 조건</span>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="예: 20-30대 선호"
              maxLength={500}
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>
        </div>

        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">여행 스타일</span>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="예: 맛집 탐방 위주, 느긋한 일정"
            maxLength={500}
            className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
          />
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">상세 설명</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={3000}
            rows={5}
            className="rounded-sm border border-border-strong bg-canvas px-md py-sm text-body-md text-ink"
          />
        </label>

        {contactWarning ? <p className="text-body-sm font-medium text-danger">{contactWarning}</p> : null}

        <label className="flex items-start gap-sm">
          <input
            type="checkbox"
            checked={agreedToSafety}
            onChange={(e) => setAgreedToSafety(e.target.checked)}
            required
            className="mt-xxs h-5 w-5"
          />
          <span className="text-body-sm text-body">
            <Link href="/policies/safety" className="text-coral hover:text-coral-active">
              동행 안전수칙
            </Link>
            을 확인했으며 이에 동의합니다.
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="btn-primary inline-flex items-center gap-xs self-start"
        >
          {isSubmitting ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-on-coral border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          동행글 등록하기
        </button>

        {submitError ? (
          <div className="flex items-center gap-sm">
            <p className="text-body-sm font-medium text-danger">{submitError}</p>
            <button
              type="button"
              onClick={() => void submitForm()}
              className="text-body-sm font-medium text-coral hover:text-coral-active"
            >
              다시 시도
            </button>
          </div>
        ) : null}
      </form>

      <Toast messages={messages} onDismiss={dismissToast} />
    </>
  );
}
