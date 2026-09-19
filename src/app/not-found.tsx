'use client';

import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/**
 * 404 Not Found Page
 * REQ-FUNC-078 — Recovery actions: home, back, retry for page not found
 */

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header />

      <main className="flex-1 flex items-center justify-center px-md py-section-mobile-max md:py-section-desktop-max">
        <div className="w-full max-w-md text-center">
          {/* Error Code */}
          <div className="mb-lg md:mb-xl">
            <p className="text-display-xl font-bold text-coral mb-sm">404</p>
            <h1 className="text-display-md font-semibold text-ink mb-md">페이지를 찾을 수 없습니다</h1>
            <p className="text-body-md text-body">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-col gap-sm">
            <Link
              href="/"
              className="btn-primary"
            >
              홈으로 이동
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              이전 페이지로 돌아가기
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-lg md:mt-xl pt-lg md:pt-xl border-t border-hairline">
            <p className="text-body-sm text-muted mb-md">문제가 계속되면?</p>
            <Link
              href="/support"
              className="text-body-sm text-coral hover:text-coral-active font-medium transition-colors"
            >
              고객 지원 문의
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
