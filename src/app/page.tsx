import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { destinations } from '@/data/destinations';
import { countrySafetyData } from '@/data/safety';
import { representative } from '@/data/representative';
import { DestinationSection } from '@/components/scr001/HomeSections';
import { SafetyDrawer } from '@/components/scr001/SafetyDrawer';
import { MatePreview } from '@/components/scr001/MatePreview';

export const metadata: Metadata = {
  title: 'free_traveler — 여행 준비 플랫폼',
  description: '국내외 여행지 정보, 국가별 안전정보, 동행 찾기까지 한 곳에서 준비하는 여행 준비 플랫폼입니다.',
  alternates: { canonical: '/' },
};

/**
 * SCR-001 — Home (/)
 * REQ-FUNC-001,002,003,004,005,006,007,008,009,046~054,057,059,060,062,063,064,065,068,070,079
 *
 * Page Owner: assembles already-completed Component/Data/API/Shared Task
 * output into the fixed 7-section order from design-reference/UI_CONTRACT.md
 * and SCREEN_ROUTE_CONTRACT.json. No new business logic is introduced here
 * beyond composing those pieces (DestinationSection in HomeSections.tsx is
 * the minimal client-state glue those components need — see its own doc
 * comment).
 */

const MIN_THEME_CHIPS = 6;
const MIN_DOMESTIC_CARDS = 6;
const MIN_INTERNATIONAL_CARDS = 6;
const MIN_SAFETY_CARDS = 6;

/**
 * Enforces PAGE-SCR001's minimum grid sizes at render time (not just at data
 * authoring time) so a future edit to the static data that drops below the
 * contractually required minimum fails loudly instead of silently shipping
 * a thin page.
 */
function assertMinimumGridSizes(): void {
  const domesticCount = destinations.filter((d) => d.type === 'domestic').length;
  const internationalCount = destinations.filter((d) => d.type === 'international').length;

  const failures: string[] = [];
  if (domesticCount < MIN_DOMESTIC_CARDS) {
    failures.push(`Domestic destinations: ${domesticCount} < ${MIN_DOMESTIC_CARDS}`);
  }
  if (internationalCount < MIN_INTERNATIONAL_CARDS) {
    failures.push(`International destinations: ${internationalCount} < ${MIN_INTERNATIONAL_CARDS}`);
  }
  if (countrySafetyData.length < MIN_SAFETY_CARDS) {
    failures.push(`Safety countries: ${countrySafetyData.length} < ${MIN_SAFETY_CARDS}`);
  }

  if (failures.length > 0) {
    throw new Error(`SCR-001 minimum grid size violated:\n${failures.join('\n')}`);
  }
}

function topThemes(limit: number): string[] {
  const counts = new Map<string, number>();
  for (const destination of destinations) {
    for (const theme of destination.themes) {
      counts.set(theme, (counts.get(theme) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([theme]) => theme);
}

function assertMinimumThemeChips(themes: string[]): void {
  if (themes.length < MIN_THEME_CHIPS) {
    throw new Error(`SCR-001 minimum grid size violated: Theme chips ${themes.length} < ${MIN_THEME_CHIPS}`);
  }
}

function MatePreviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-md md:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-md bg-surface-soft" />
      ))}
    </div>
  );
}

export default function Home() {
  assertMinimumGridSizes();
  const themes = topThemes(MIN_THEME_CHIPS);
  assertMinimumThemeChips(themes);

  return (
    <div className="flex flex-col">
      {/* ① 검색 Hero */}
      <section className="flex min-h-[560px] flex-col items-center justify-center gap-lg bg-surface-soft px-md py-xxl text-center md:min-h-[640px]">
        <div className="max-w-2xl">
          <h1 className="mb-md">당신의 다음 여행을 준비하세요</h1>
          <p className="text-body-md text-body">
            57번의 여행, 31개국의 경험을 담은 free_traveler와 함께 여행지 정보부터 안전정보, 동행까지 한 곳에서
            준비해보세요.
          </p>
        </div>
        <Link href="/travel-tools" className="btn-primary">
          여행 준비 시작하기
        </Link>
      </section>

      {/* ② 국내 여행지 */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-md">국내 여행지</h2>
          <DestinationSection scope="domestic" />
        </div>
      </section>

      {/* ③ 해외 여행지 */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-md">해외 여행지</h2>
          <DestinationSection scope="international" />
        </div>
      </section>

      {/* ④ 여행 동기·테마 */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-md">인기 여행 테마</h2>
          <div className="flex flex-wrap gap-sm">
            {themes.map((theme) => (
              <span key={theme} className="chip pointer-events-none">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 국가별 주의사항 */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-md">국가별 여행 안전정보</h2>
          <SafetyDrawer />
        </div>
      </section>

      {/* ⑥ 최근 동행글 */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-md">최근 동행글</h2>
          <Suspense fallback={<MatePreviewSkeleton />}>
            <MatePreview />
          </Suspense>
        </div>
      </section>

      {/* ⑦ free_traveler 요약 */}
      <section className="bg-ink px-md py-section-mobile-min text-canvas md:px-lg md:py-section-desktop-min">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-md text-center">
          <p className="text-caption uppercase tracking-wide text-canvas/60">Curator</p>
          <h2 className="text-canvas">{representative.name}</h2>
          <p className="max-w-2xl text-body-md text-canvas/80">{representative.intro}</p>
          <div className="flex gap-lg text-body-sm text-canvas/80">
            <span>{representative.tripCount}+ Trips</span>
            <span>{representative.countryCount}+ Countries</span>
          </div>
          <Link href="/about" className="btn-primary mt-sm">
            대표 소개 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
