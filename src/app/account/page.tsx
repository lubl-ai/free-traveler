import type { Metadata } from 'next';
import { AccountSections } from '@/components/scr005/AccountSections';

/**
 * SCR-005 — Account (/account)
 * REQ-FUNC-028,029,036,038,040,041,042,066,068,077
 *
 * Page Owner: assembles the already-completed Auth/Profile/MyActivity/Admin
 * components. AccountSections (scr005/) is the minimal client-state glue
 * that decides which role's section tree to render — see its own doc
 * comment. Loading/error states for each sub-section are already built
 * into the components themselves (CMP-SCR005-* own ACs).
 */

export const metadata: Metadata = {
  title: '계정 — free_traveler',
  description: '로그인, 프로필 관리, 내 활동을 확인하세요.',
  alternates: { canonical: '/account' },
};

export default function Account() {
  return (
    <div className="px-md py-section-mobile-min md:px-lg md:py-section-desktop-min">
      <div className="mx-auto max-w-3xl">
        <AccountSections />
      </div>
    </div>
  );
}
