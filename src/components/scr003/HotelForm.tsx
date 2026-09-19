'use client';

import { useMemo, useState } from 'react';
import { destinations } from '@/data/destinations';

/**
 * Hotel Condition Input + Summary + External Handoff
 * REQ-FUNC-019,020,021,022,023,024,025,026
 *
 * CLAUDE.md 규칙 12 / this task's Security AC: country/region/date input
 * NEVER leaves the client — no server request, no DB write, no query
 * params on the outbound URL. Date validation is client-state-only
 * (no server API), exposed as `validateHotelDates` so UNIT-TRAVEL-DATES
 * can test it directly.
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

export function validateHotelDates(
  checkInDate: string,
  checkOutDate: string,
  today: Date = new Date()
): { valid: true } | { valid: false; error: string } {
  if (!checkInDate || !checkOutDate) {
    return { valid: false, error: '체크인과 체크아웃 날짜를 모두 입력해주세요.' };
  }

  const todayStr = today.toISOString().slice(0, 10);
  if (checkInDate < todayStr) {
    return { valid: false, error: '체크인 날짜는 오늘 이후여야 합니다.' };
  }
  if (checkOutDate <= checkInDate) {
    return { valid: false, error: '체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.' };
  }

  return { valid: true };
}

export function HotelForm() {
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [outboundError, setOutboundError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const regionOptions = country ? COUNTRY_REGIONS[country] ?? [] : [];

  const dateValidation = useMemo(
    () => validateHotelDates(checkInDate, checkOutDate),
    [checkInDate, checkOutDate]
  );

  const canSubmit = Boolean(country && region && checkInDate && checkOutDate);

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry);
    setRegion('');
    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (canSubmit) {
      setSubmitted(true);
    }
  }

  async function handleOpenOutbound() {
    setOutboundError(null);
    setIsOpening(true);

    // Open the tab SYNCHRONOUSLY, before the `await` below — see FlightForm's
    // identical fix for the full explanation (E2E-TRAVEL-TOOLS found this
    // via a real Chromium popup-blocking test).
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.opener = null; // same isolation as rel="noopener"
    }

    try {
      const response = await fetch('/api/admin/settings/outbound?key=HOTEL_OUTBOUND_URL');
      if (!response.ok) {
        newTab?.close();
        setOutboundError('숙소 검색 사이트 주소가 설정되어 있지 않습니다.');
        return;
      }
      const data = (await response.json()) as { value: string };
      if (!data.value || !data.value.startsWith('https://')) {
        newTab?.close();
        setOutboundError('설정된 주소가 올바르지 않습니다.');
        return;
      }
      if (!newTab) {
        setOutboundError('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제한 후 다시 시도해주세요.');
        return;
      }
      newTab.document.write(
        `<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0;url=${data.value}">`
      );
      newTab.document.close();
    } catch {
      newTab?.close();
      setOutboundError('숙소 검색 사이트로 이동하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setIsOpening(false);
    }
  }

  const showValidSummary = submitted && dateValidation.valid;

  return (
    <div className="flex flex-col gap-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">국가</span>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
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
            <span className="text-body-sm font-medium text-ink">체크인</span>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => {
                setCheckInDate(e.target.value);
                setSubmitted(false);
              }}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">체크아웃</span>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => {
                setCheckOutDate(e.target.value);
                setSubmitted(false);
              }}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>
        </div>

        {submitted && !dateValidation.valid ? (
          <p className="text-body-sm font-medium text-danger">{dateValidation.error}</p>
        ) : null}

        <button type="submit" disabled={!canSubmit} className="btn-secondary self-start">
          조건 확인
        </button>
      </form>

      {showValidSummary ? (
        <div className="card rounded-md p-lg">
          <h3 className="text-title-sm text-ink mb-sm">숙소 조건 요약</h3>
          <dl className="grid grid-cols-2 gap-sm text-body-sm text-body mb-md">
            <dt className="text-muted">국가</dt>
            <dd>{country}</dd>
            <dt className="text-muted">지역</dt>
            <dd>{region}</dd>
            <dt className="text-muted">체크인</dt>
            <dd>{checkInDate}</dd>
            <dt className="text-muted">체크아웃</dt>
            <dd>{checkOutDate}</dd>
          </dl>
          <p className="text-caption text-muted-soft mb-md">
            입력하신 조건은 서버로 전송되지 않으며, 이 기기에서만 임시로 사용됩니다.
          </p>
          <button type="button" onClick={handleOpenOutbound} disabled={isOpening} className="btn-primary">
            호텔 보러 가기
          </button>
          {outboundError ? (
            <div className="mt-sm flex items-center gap-sm">
              <p className="text-body-sm text-danger">{outboundError}</p>
              <button type="button" onClick={handleOpenOutbound} className="text-body-sm font-medium text-coral hover:text-coral-active">
                다시 시도
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
