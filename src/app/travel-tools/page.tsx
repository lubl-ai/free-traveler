import type { Metadata } from 'next';
import { TabSwitcher, type TabId } from '@/components/scr003/TabSwitcher';
import { FlightForm } from '@/components/scr003/FlightForm';
import { HotelForm } from '@/components/scr003/HotelForm';
import { MateWriteForm } from '@/components/scr003/MateWriteForm';

/**
 * SCR-003 — Travel Tools (/travel-tools)
 * REQ-FUNC-011~026,027,028,029,031,032,080
 *
 * Page Owner: assembles the already-completed tab shell (CMP-SCR003-TABS)
 * with its three panels (CMP-SCR003-FLIGHT / -HOTEL / -MATE-WRITE). Each
 * panel already contains its own input form + summary + external-handoff
 * action card (③④ in the fixed section order are the same component), and
 * MateWriteForm already contains its own login-prompt/form branching (⑥).
 * This page only adds the two purely static sections (① Intro, ⑤ Tips) and
 * wires the tab shell together.
 */

export const metadata: Metadata = {
  title: '여행 준비 — free_traveler',
  description: '항공편·숙소 조건을 정리하고, 같은 일정의 동행을 찾아보세요.',
  alternates: { canonical: '/travel-tools' },
};

const TIPS = [
  '여러 예약 사이트에서 가격을 비교하면 더 좋은 조건을 찾을 수 있어요.',
  '출발/도착 시간대를 하루 정도 조정하면 항공권이 더 저렴해지는 경우가 많아요.',
  '숙소는 후기와 실제 위치(역·시내 접근성)를 함께 확인하는 것이 좋아요.',
];

function isTabId(value: string | undefined): value is TabId {
  return value === 'flight' || value === 'hotel' || value === 'mate';
}

export default async function TravelTools({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const defaultTab: TabId = isTabId(params.tab) ? params.tab : 'flight';

  return (
    <div className="flex flex-col">
      {/* ① Intro */}
      <section className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-sm">여행 준비를 시작해보세요</h1>
          <p className="text-body-md text-body mb-lg">
            항공편·숙소 조건을 정리하고 외부 예약 사이트로 이동하거나, 같은 일정으로 떠날 동행을 찾아보세요.
          </p>
          <ol className="mx-auto flex max-w-xl flex-col gap-sm text-left sm:flex-row sm:justify-between sm:gap-md sm:text-center">
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">1</p>
              <p className="text-body-sm text-body">탭을 선택해 조건을 입력하세요</p>
            </li>
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">2</p>
              <p className="text-body-sm text-body">요약 내용을 확인하세요</p>
            </li>
            <li className="flex-1">
              <p className="text-title-sm text-coral mb-xxs">3</p>
              <p className="text-body-sm text-body">외부 사이트로 이동하거나 동행글을 등록하세요</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ② 3탭 전환 + ③④ 조건 입력/요약/외부 이동 + ⑥ 동행 Form/로그인 안내 */}
      <section className="px-md pb-section-mobile-min md:px-lg md:pb-section-desktop-min">
        <div className="mx-auto max-w-3xl">
          <TabSwitcher
            defaultTab={defaultTab}
            flightPanel={<FlightForm />}
            hotelPanel={<HotelForm />}
            matePanel={<MateWriteForm />}
          />
        </div>
      </section>

      {/* ⑤ 찾기 Tip 3개 */}
      <section className="bg-surface-soft px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-md">찾기 Tip</h2>
          <ul className="flex flex-col gap-sm">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-sm text-body-sm text-body">
                <span className="text-coral" aria-hidden="true">
                  •
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
