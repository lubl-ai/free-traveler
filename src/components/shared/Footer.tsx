import Link from 'next/link';

/**
 * Global Footer Component
 * REQ-FUNC-064,065 — Brand intro + Service/Info/Policy 3-column layout + external links
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-soft border-t border-hairline">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-md md:px-lg py-lg md:py-xxl">
        {/* Brand Section */}
        <div className="mb-xl md:mb-xxl">
          <h3 className="text-title-md font-semibold text-ink mb-sm">free_traveler</h3>
          <p className="text-body-sm text-body max-w-md">
            세계를 무대로 활동하는 여행 큐레이터, free_traveler와 함께 진정한 여행을 준비하세요. 57번의 여행, 31개 국가의 경험을 담은 여행 준비 플랫폼입니다.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl md:mb-xxl">
          {/* Service Column */}
          <div>
            <h4 className="text-body-md font-semibold text-ink mb-md">서비스</h4>
            <ul className="space-y-xs">
              <li>
                <Link href="/travel-tools" className="text-body-sm text-body hover:text-coral transition-colors">
                  여행 준비
                </Link>
              </li>
              <li>
                <Link href="/mates" className="text-body-sm text-body hover:text-coral transition-colors">
                  동행 찾기
                </Link>
              </li>
              <li>
                <Link href="/representative" className="text-body-sm text-body hover:text-coral transition-colors">
                  대표 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h4 className="text-body-md font-semibold text-ink mb-md">정보</h4>
            <ul className="space-y-xs">
              <li>
                <Link href="/faq" className="text-body-sm text-body hover:text-coral transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-body-sm text-body hover:text-coral transition-colors">
                  고객 지원
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-body-sm text-body hover:text-coral transition-colors">
                  여행 블로그
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Column */}
          <div>
            <h4 className="text-body-md font-semibold text-ink mb-md">약관·정책</h4>
            <ul className="space-y-xs">
              <li>
                <Link href="/policies/terms" className="text-body-sm text-body hover:text-coral transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-body-sm text-body hover:text-coral transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/policies/safety" className="text-body-sm text-body hover:text-coral transition-colors">
                  안전수칙
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* External Links & Notice */}
        <div className="border-t border-hairline pt-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-md">
            {/* Social Links */}
            <div className="flex items-center gap-md">
              <a
                href="https://instagram.com/freetraveler"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-muted hover:text-coral transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span className="text-hairline">•</span>
              <a
                href="https://youtube.com/@freetraveler"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-muted hover:text-coral transition-colors"
                aria-label="YouTube"
              >
                YouTube
              </a>
              <span className="text-hairline">•</span>
              <a
                href="https://blog.freetraveler.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-muted hover:text-coral transition-colors"
                aria-label="Blog"
              >
                Blog
              </a>
            </div>

            {/* Copyright */}
            <p className="text-caption text-muted-soft text-center md:text-right">
              © {currentYear} free_traveler. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
