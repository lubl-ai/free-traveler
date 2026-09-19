'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/**
 * Error Boundary Page
 * REQ-FUNC-078 — Recovery actions: home, retry for server/connection errors
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header />

      <main className="flex-1 flex items-center justify-center px-md py-section-mobile-max md:py-section-desktop-max">
        <div className="w-full max-w-md text-center">
          {/* Error Code */}
          <div className="mb-lg md:mb-xl">
            <p className="text-display-xl font-bold text-coral mb-sm">500</p>
            <h1 className="text-display-md font-semibold text-ink mb-md">서버 오류가 발생했습니다</h1>
            <p className="text-body-md text-body">
              일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-col gap-sm">
            <button
              onClick={() => reset()}
              className="btn-primary"
            >
              다시 시도
            </button>
            <Link
              href="/"
              className="btn-secondary"
            >
              홈으로 이동
            </Link>
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
            {error.digest && (
              <p className="text-caption text-muted-soft mt-md">
                오류 ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
