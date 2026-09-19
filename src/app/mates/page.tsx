import Link from 'next/link';
import type { Metadata } from 'next';
import { MateSection } from '@/components/scr004/MateSection';

/**
 * SCR-004 — Mates (/mates)
 * REQ-FUNC-030,033,034,035,036,037,039,040,079,080
 *
 * Page Owner: assembles the already-completed Filter/List/Detail/
 * Application/Report/Block components. MateSection (in scr004/) is the
 * minimal client-state glue those components need to share filter
 * criteria, selection, and result count — see its own doc comment.
 * List/Detail already contain their own skeleton-loading and
 * danger-text+retry error states (CMP-SCR004-LIST/-DETAIL's own ACs).
 */

export const metadata: Metadata = {
  title: '동행 찾기 — free_traveler',
  description: '같은 일정으로 떠나는 동행을 찾아보세요.',
  alternates: { canonical: '/mates' },
};

export default function Mates() {
  return (
    <div className="flex flex-col">
      {/* ① Intro + 작성 CTA */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-md text-center">
          <div>
            <h1 className="mb-sm">동행을 찾아보세요</h1>
            <p className="text-body-md text-body">
              같은 일정, 같은 국가로 떠나는 여행자와 동행글을 통해 만날 수 있어요.
            </p>
          </div>
          <Link href="/travel-tools?tab=mate" className="btn-primary">
            동행글 작성하기
          </Link>
        </div>
      </section>

      {/* ②③④ 검색 Filter + 목록 + 상세 분할/Drawer */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-6xl">
          <MateSection />
        </div>
      </section>

      {/* ⑤ 참가 신청 방법 */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-lg">참가 신청 방법</h2>
          <ol className="flex flex-col gap-md sm:flex-row sm:gap-lg">
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">1</p>
              <p className="text-body-sm text-body">관심있는 동행글을 선택해 상세 내용을 확인하세요</p>
            </li>
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">2</p>
              <p className="text-body-sm text-body">&ldquo;참가 요청 보내기&rdquo;를 눌러 간단한 메시지를 남기세요</p>
            </li>
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">3</p>
              <p className="text-body-sm text-body">작성자가 승인하면 함께 여행을 준비할 수 있어요</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ⑥ 안전·신고·차단 안내 */}
      <section className="bg-ink px-md py-section-mobile-min text-canvas md:px-lg md:py-section-desktop-min">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-md text-center">
          <h2 className="text-canvas">안전한 동행을 위해</h2>
          <p className="text-body-sm text-canvas/80">
            낯선 사람과의 만남이니 만큼 개인정보 공유는 신중히, 공개된 장소에서 첫 만남을 갖는 것을 권장합니다.
            불편한 상황이 발생하면 즉시 신고하거나 차단할 수 있어요.
          </p>
          <Link href="/travel-tools" className="btn-primary">
            여행 준비 계속하기
          </Link>
        </div>
      </section>
    </div>
  );
}
