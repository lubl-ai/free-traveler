'use client';

import { useEffect, useState } from 'react';
import { countrySafetyData, type CountrySafety, type SafetyAlert } from '@/data/safety';

/**
 * Country Safety Card + Drawer
 * REQ-FUNC-046,047,048,049,050,051,052,053,054
 *
 * A compact grid of per-country safety cards; selecting one opens a Drawer
 * with the full category breakdown, source/verified-at, a stale warning
 * (computed at render time from `verified_at`, no batch job), the original
 * MOFA (외교부) advisory portal link, the Korean consular emergency hotline
 * (REQ-FUNC-053 — a fixed government number, not per-country data), and the
 * "not an official determination" disclaimer (REQ-FUNC-054).
 */

const STALE_DAYS_THRESHOLD = 7;
const MOFA_PORTAL_URL = 'https://www.0404.go.kr';
const CONSULAR_CALL_CENTER = {
  label: '영사콜센터(24시간, 유료)',
  phone: '+82-2-3210-0404',
};

const LEVEL_STYLES: Record<SafetyAlert['level'], { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-success/10', text: 'text-success', label: '안전' },
  yellow: { bg: 'bg-warning/10', text: 'text-warning', label: '주의' },
  orange: { bg: 'bg-danger/10', text: 'text-danger', label: '경보' },
  red: { bg: 'bg-danger/10', text: 'text-danger', label: '위험' },
};

function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function highestLevel(alerts: SafetyAlert[]): SafetyAlert['level'] {
  const order: SafetyAlert['level'][] = ['red', 'orange', 'yellow', 'green'];
  for (const level of order) {
    if (alerts.some((a) => a.level === level)) {
      return level;
    }
  }
  return 'green';
}

function SafetyLevelBadge({ level }: { level: SafetyAlert['level'] }) {
  const style = LEVEL_STYLES[level];
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-sm py-xxs text-caption font-medium ${style.bg} ${style.text}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {style.label}
    </span>
  );
}

function SafetyCountryCard({ country, onOpen }: { country: CountrySafety; onOpen: () => void }) {
  const isStale = daysSince(country.verified_at) > STALE_DAYS_THRESHOLD;
  const level = highestLevel(country.alerts);
  const hasCriticalAlert = level === 'red' || level === 'orange';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="card w-full rounded-md p-md text-left transition-shadow hover:shadow-floating"
    >
      {hasCriticalAlert ? (
        <p className="mb-xs text-caption font-semibold text-danger">중대 경보 발령 중</p>
      ) : null}
      <div className="flex items-start justify-between gap-sm">
        <div>
          <p className="text-title-sm text-ink">{country.countryNameKo}</p>
          <p className="text-caption text-muted">{country.scopeText}</p>
        </div>
        <SafetyLevelBadge level={level} />
      </div>
      {isStale ? (
        <p className="mt-sm text-caption font-medium text-warning">
          최종 확인일로부터 {daysSince(country.verified_at)}일 경과 — 최신 정보 확인 필요
        </p>
      ) : (
        <p className="mt-sm text-caption text-muted-soft">최종 확인일 {country.verified_at}</p>
      )}
    </button>
  );
}

function SafetyDrawerPanel({ country, onClose }: { country: CountrySafety; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isStale = daysSince(country.verified_at) > STALE_DAYS_THRESHOLD;
  const level = highestLevel(country.alerts);
  const hasCriticalAlert = level === 'red' || level === 'orange';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-[var(--shadow-scrim)]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${country.countryNameKo} 안전정보`}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-canvas shadow-floating md:rounded-lg"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-canvas px-lg py-md">
          <div>
            <h2 className="text-title-md text-ink">{country.countryNameKo}</h2>
            <p className="text-caption text-muted">{country.scopeText}</p>
          </div>
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
          {hasCriticalAlert ? (
            <p className="mb-md rounded-sm bg-danger/10 px-md py-sm text-body-sm font-semibold text-danger">
              중대 경보 발령 중 — 아래 세부 카테고리를 확인하세요.
            </p>
          ) : null}

          {isStale ? (
            <p className="mb-md rounded-sm bg-warning/10 px-md py-sm text-body-sm font-medium text-warning">
              최종 확인일로부터 {daysSince(country.verified_at)}일이 지났습니다. 최신 정보는 아래 외교부 링크에서 확인하세요.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
            {country.alerts.map((alert) => (
              <div key={alert.category} className="rounded-sm border border-hairline p-sm">
                <div className="mb-xxs flex items-center justify-between">
                  <p className="text-body-sm font-semibold text-ink">{alert.category}</p>
                  <SafetyLevelBadge level={alert.level} />
                </div>
                <p className="text-body-sm text-body">{alert.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-lg rounded-sm bg-surface-soft p-md">
            <p className="text-body-sm font-semibold text-ink">{CONSULAR_CALL_CENTER.label}</p>
            <p className="text-body-sm text-body">{CONSULAR_CALL_CENTER.phone}</p>
          </div>

          <div className="mt-md flex flex-col gap-xxs text-caption text-muted">
            <p>출처: {country.source}</p>
            <p>최종 확인일: {country.verified_at}</p>
          </div>

          <a
            href={MOFA_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-md inline-block text-body-sm font-medium text-coral hover:text-coral-active"
          >
            외교부 해외안전여행 원문 보기 →
          </a>

          <p className="mt-lg border-t border-hairline pt-md text-caption text-muted-soft">
            이 정보는 참고용이며 정부의 공식 판단을 대체할 수 없습니다. 출국 전 반드시 외교부 해외안전여행 홈페이지에서 최신 정보를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SafetyDrawer() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const selectedCountry = countrySafetyData.find((c) => c.countryCode === selectedCountryCode) ?? null;

  return (
    <div>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
        {countrySafetyData.map((country) => (
          <SafetyCountryCard
            key={country.countryCode}
            country={country}
            onOpen={() => setSelectedCountryCode(country.countryCode)}
          />
        ))}
      </div>
      {selectedCountry ? (
        <SafetyDrawerPanel country={selectedCountry} onClose={() => setSelectedCountryCode(null)} />
      ) : null}
    </div>
  );
}
