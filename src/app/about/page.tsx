import Link from 'next/link';
import type { Metadata } from 'next';
import { representative } from '@/data/representative';
import { destinations } from '@/data/destinations';
import { Timeline } from '@/components/scr002/Timeline';
import { CountryChips } from '@/components/scr002/CountryChips';
import { Gallery } from '@/components/scr002/Gallery';

/**
 * SCR-002 — About / Representative (/about)
 * REQ-FUNC-057,058,059,060,061,062,063,064,065,079
 *
 * Page Owner: assembles already-completed Component/Data Task output into
 * the fixed 7-section order from UI_CONTRACT.md / SCREEN_ROUTE_CONTRACT.json.
 * This page reads only static data (DATA-REPRESENTATIVE / DATA-DESTINATIONS)
 * — no network calls, so no Loading/Error states apply (per D-001
 * §Loading·Empty·Error, reviewed as required by this task's own AC).
 */

export const metadata: Metadata = {
  title: 'free_traveler 대표 소개',
  description: `${representative.tripCount}+번의 여행, ${representative.countryCount}+개국의 경험을 가진 free_traveler를 소개합니다.`,
  alternates: { canonical: '/about' },
};

const MIN_GALLERY_IMAGES = 8;
const MIN_COUNTRIES = 30;

function assertMinimumSectionSizes(): void {
  const failures: string[] = [];
  if (representative.timeline.length < 6) {
    failures.push(`Timeline: ${representative.timeline.length} < 6`);
  }
  if (representative.visitedCountries.length < MIN_COUNTRIES) {
    failures.push(`Visited countries: ${representative.visitedCountries.length} < ${MIN_COUNTRIES}`);
  }
  if (representative.gallery.length < MIN_GALLERY_IMAGES) {
    failures.push(`Gallery: ${representative.gallery.length} < ${MIN_GALLERY_IMAGES}`);
  }

  if (failures.length > 0) {
    throw new Error(`SCR-002 minimum section size violated:\n${failures.join('\n')}`);
  }
}

export default function About() {
  assertMinimumSectionSizes();

  const memorableDestinations = representative.recommendedDestinations
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="flex flex-col">
      {/* ① Profile Hero */}
      <section className="flex min-h-[560px] flex-col items-center justify-center gap-md bg-surface-soft px-md py-xxl text-center md:min-h-[640px]">
        <div className="h-32 w-32 overflow-hidden rounded-full bg-surface-strong" aria-hidden={!representative.profileImage.url}>
          {representative.profileImage.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={representative.profileImage.url}
              alt={representative.profileImage.alt}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="max-w-xl">
          <h1 className="mb-xs">{representative.name}</h1>
          <p className="text-body-md text-body">
            {representative.tripCount}+번의 여행, {representative.countryCount}+개국의 경험을 가진 여행 큐레이터
          </p>
        </div>
      </section>

      {/* ② 여행 지표 */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-lg sm:flex-row sm:justify-center sm:gap-xxl">
          <div className="text-center">
            <p className="text-display-lg font-bold text-coral">{representative.tripCount}+</p>
            <p className="text-body-sm text-muted">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-display-lg font-bold text-coral">{representative.countryCount}+</p>
            <p className="text-body-sm text-muted">Countries</p>
          </div>
        </div>
      </section>

      {/* ③ 소개·철학 */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto flex max-w-3xl flex-col gap-md">
          <div>
            <h2 className="mb-sm">소개</h2>
            <p className="text-body-md text-body">{representative.intro}</p>
          </div>
          <div>
            <h2 className="mb-sm">여행 철학</h2>
            <p className="text-body-md text-body">{representative.philosophy}</p>
          </div>
        </div>
      </section>

      {/* ④ Timeline */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-lg">여행 타임라인</h2>
          <Timeline />
        </div>
      </section>

      {/* ⑤ 방문 국가 */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-lg">방문 국가</h2>
          <CountryChips />
        </div>
      </section>

      {/* ⑥ Gallery */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-lg">여행 갤러리</h2>
          <Gallery />
        </div>
      </section>

      {/* ⑦ 기억에 남는 여행지 + CTA */}
      <section className="bg-ink px-md py-section-mobile-min text-canvas md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-lg text-center text-canvas">기억에 남는 여행지</h2>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
            {memorableDestinations.map((destination) => (
              <div key={destination.id} className="rounded-md bg-canvas/10 p-md">
                <p className="text-caption text-canvas/60 mb-xxs">{destination.country}</p>
                <p className="text-title-sm text-canvas">{destination.nameKo}</p>
              </div>
            ))}
          </div>
          <div className="mt-xl flex flex-col items-center gap-sm sm:flex-row sm:justify-center sm:gap-md">
            <Link href="/travel-tools" className="btn-primary">
              여행 준비 시작하기
            </Link>
            <Link href="/mates" className="btn-secondary bg-transparent text-canvas border-canvas/40 hover:bg-canvas/10">
              동행 찾아보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
