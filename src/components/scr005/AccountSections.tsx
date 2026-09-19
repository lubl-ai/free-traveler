'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';
import { AuthTab } from '@/components/scr005/AuthTab';
import { ProfileTab } from '@/components/scr005/ProfileTab';
import { MyActivityTab } from '@/components/scr005/MyActivityTab';
import { AdminTab } from '@/components/scr005/AdminTab';

/**
 * PAGE-SCR005 assembly glue
 *
 * AuthTab, ProfileTab, MyActivityTab, and AdminTab each already do their
 * own internal auth checks, but PAGE-SCR005's AC requires the page to show
 * ONLY the section tree for the viewer's actual role (Guest/Member/Admin) —
 * not, say, ProfileTab's own "로그인이 필요합니다" fallback bleeding into a
 * Guest view that should show the login form instead. That decision needs
 * one shared role check made once at the page level, which a Server
 * Component (page.tsx) can't hold — same reasoning as HomeSections.tsx /
 * MateSection.tsx for SCR-001/SCR-004.
 */

type Role = 'guest' | 'member' | 'admin';

function useRole(): Role | undefined {
  const [role, setRole] = useState<Role | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createBrowserDbClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) setRole('guest');
          return;
        }

        const { data: profile } = await supabase.from('user_profile').select('role').eq('id', user.id).single();
        if (!cancelled) setRole(profile?.role === 'admin' ? 'admin' : 'member');
      } catch {
        if (!cancelled) setRole('guest');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return role;
}

export function AccountSections() {
  const role = useRole();

  if (role === undefined) {
    return <div className="h-64 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (role === 'guest') {
    return <GuestView />;
  }

  if (role === 'admin') {
    return <AdminView />;
  }

  return <MemberView />;
}

function GuestView() {
  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h2 className="mb-sm">로그인하고 더 많은 기능을 이용하세요</h2>
        <p className="text-body-sm text-body">
          동행글 작성, 참가 요청, 즐겨찾기 저장 등은 로그인 후 이용할 수 있습니다.
        </p>
      </div>

      <AuthTab />

      <div>
        <p className="mb-sm text-body-sm font-medium text-ink">로그인 후 가능한 기능</p>
        <div className="flex flex-wrap gap-xs">
          {['동행글 작성', '참가 요청', '프로필 관리', '즐겨찾기 저장', '신고·차단'].map((feature) => (
            <span key={feature} className="chip pointer-events-none">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-info/10 px-md py-md">
        <p className="text-body-sm text-ink">
          비밀번호는 Supabase Auth를 통해 암호화되어 저장되며, 평문으로 직접 저장하지 않습니다. 성인 확인은
          생년월일이 아닌 확인 여부와 확인 시각만 기록합니다.
        </p>
      </div>
    </div>
  );
}

function MemberView() {
  return (
    <div className="flex flex-col gap-xl">
      <section>
        <h2 className="mb-md">내 프로필</h2>
        <ProfileTab />
      </section>

      <section>
        <h2 className="mb-md">내 활동</h2>
        <MyActivityTab />
      </section>

      <div className="text-center">
        <Link href="/travel-tools?tab=mate" className="btn-primary">
          새 동행글 작성하기
        </Link>
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h2 className="mb-sm">관리자 도구</h2>
        <p className="text-body-sm text-body">신고 상태를 처리하고 항공·숙소 외부 링크를 관리할 수 있습니다.</p>
      </div>
      <AdminTab />
    </div>
  );
}
