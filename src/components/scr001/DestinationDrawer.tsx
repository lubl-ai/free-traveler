'use client';

import { useEffect, useState } from 'react';
import { destinations } from '@/data/destinations';
import { countrySafetyData, type SafetyAlert } from '@/data/safety';

/**
 * Destination Detail Drawer
 * REQ-FUNC-004,006,007,009
 *
 * Desktop: 480px right-side slide-in. Mobile: bottom sheet.
 * For international destinations, a "국가 안전정보 보기" link switches the
 * same drawer stack to a safety view (matched by country name against
 * DATA-SAFETY) without opening a second overlay — "뒤로" returns to the
 * destination detail view.
 */

const LEVEL_STYLES: Record<SafetyAlert['level'], { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-success/10', text: 'text-success', label: '안전' },
  yellow: { bg: 'bg-warning/10', text: 'text-warning', label: '주의' },
  orange: { bg: 'bg-danger/10', text: 'text-danger', label: '경보' },
  red: { bg: 'bg-danger/10', text: 'text-danger', label: '위험' },
};

function formatBudget(min: number, max: number): string {
  const formatter = new Intl.NumberFormat('ko-KR');
  return `1일 ${formatter.format(min)}원 ~ ${formatter.format(max)}원`;
}

export interface DestinationDrawerProps {
  destinationId: string | null;
  onClose: () => void;
}

export function DestinationDrawer({ destinationId, onClose }: DestinationDrawerProps) {
  const destination = destinations.find((d) => d.id === destinationId) ?? null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    if (destination) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [destination, onClose]);

  if (!destination) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end md:items-stretch">
      <div className="absolute inset-0 bg-[var(--shadow-scrim)]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.nameKo} 상세정보`}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-canvas shadow-floating md:h-full md:max-h-none md:w-[480px] md:rounded-none"
      >
        {/* Keyed by destinationId so switching destinations resets the internal detail/safety view */}
        <DrawerContent key={destination.id} destination={destination} onClose={onClose} />
      </div>
    </div>
  );
}

function DrawerContent({ destination, onClose }: { destination: (typeof destinations)[number]; onClose: () => void }) {
  const [view, setView] = useState<'detail' | 'safety'>('detail');
  const safetyInfo = countrySafetyData.find((c) => c.countryNameKo === destination.country);

  if (view === 'detail') {
    return (
      <DetailView destination={destination} onClose={onClose} onShowSafety={safetyInfo ? () => setView('safety') : undefined} />
    );
  }

  if (safetyInfo) {
    return <SafetyView safety={safetyInfo} onBack={() => setView('detail')} onClose={onClose} />;
  }

  return null;
}

function DrawerHeader({
  title,
  subtitle,
  onBack,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-canvas px-lg py-md">
      <div className="flex items-center gap-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface-soft"
            aria-label="뒤로"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : null}
        <div>
          <h2 className="text-title-md text-ink">{title}</h2>
          {subtitle ? <p className="text-caption text-muted">{subtitle}</p> : null}
        </div>
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
  );
}

function DetailView({
  destination,
  onClose,
  onShowSafety,
}: {
  destination: (typeof destinations)[number];
  onClose: () => void;
  onShowSafety?: () => void;
}) {
  return (
    <div>
      <DrawerHeader title={destination.nameKo} subtitle={destination.country} onClose={onClose} />

      <div className="flex flex-col gap-lg px-lg py-md">
        {destination.type === 'international' && onShowSafety ? (
          <button
            type="button"
            onClick={onShowSafety}
            className="self-start rounded-sm bg-info/10 px-md py-sm text-body-sm font-medium text-info hover:bg-info/20"
          >
            국가 안전정보 보기 →
          </button>
        ) : null}

        <section>
          <h3 className="text-title-sm text-ink mb-xs">소개</h3>
          <p className="text-body-sm text-body">{destination.intro}</p>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">주요 명소</h3>
          <ul className="list-disc pl-lg text-body-sm text-body">
            {destination.attractions.map((attraction) => (
              <li key={attraction}>{attraction}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">추천 일정</h3>
          <div className="flex flex-col gap-sm">
            <div className="rounded-sm border border-hairline p-sm">
              <p className="text-body-sm font-semibold text-ink mb-xxs">1일 코스</p>
              <p className="text-body-sm text-body">{destination.itinerary1day}</p>
            </div>
            <div className="rounded-sm border border-hairline p-sm">
              <p className="text-body-sm font-semibold text-ink mb-xxs">3일 코스</p>
              <p className="text-body-sm text-body">{destination.itinerary3day}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">예산</h3>
          <p className="text-body-sm text-body">{formatBudget(destination.budget.min, destination.budget.max)}</p>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">교통</h3>
          <ul className="list-disc pl-lg text-body-sm text-body">
            {destination.transportation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">대표 음식</h3>
          <ul className="list-disc pl-lg text-body-sm text-body">
            {destination.food.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-title-sm text-ink mb-xs">현지 에티켓</h3>
          <ul className="list-disc pl-lg text-body-sm text-body">
            {destination.etiquette.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-xxs border-t border-hairline pt-md text-caption text-muted">
          <p>출처: {destination.source}</p>
          <p>최종 수정일: {destination.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}

function SafetyView({
  safety,
  onBack,
  onClose,
}: {
  safety: (typeof countrySafetyData)[number];
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <DrawerHeader title={safety.countryNameKo} subtitle={safety.scopeText} onBack={onBack} onClose={onClose} />

      <div className="px-lg py-md">
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          {safety.alerts.map((alert) => {
            const style = LEVEL_STYLES[alert.level];
            return (
              <div key={alert.category} className="rounded-sm border border-hairline p-sm">
                <div className="mb-xxs flex items-center justify-between">
                  <p className="text-body-sm font-semibold text-ink">{alert.category}</p>
                  <span className={`inline-flex items-center gap-xxs rounded-full px-sm py-xxs text-caption font-medium ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-body-sm text-body">{alert.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-md flex flex-col gap-xxs text-caption text-muted">
          <p>출처: {safety.source}</p>
          <p>최종 확인일: {safety.verified_at}</p>
        </div>
      </div>
    </div>
  );
}
