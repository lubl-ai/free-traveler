'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Global Header Component
 * REQ-FUNC-064,065 — Logo + 4 navigation items + auth entry point
 * Desktop: 72px height, Mobile: 56px height + hamburger menu
 */

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: '홈', href: '/' },
    { label: '대표 소개', href: '/representative' },
    { label: '여행 준비', href: '/travel-tools' },
    { label: '동행 찾기', href: '/mates' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
      {/* Desktop Header - 72px */}
      <nav className="hidden md:flex items-center justify-between h-[72px] px-lg">
        {/* Logo */}
        <Link href="/" className="text-title-md font-semibold text-ink hover:text-coral transition-colors">
          free_traveler
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-md text-body hover:text-coral transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-sm">
          <Link href="/auth/login" className="text-body-md text-body hover:text-coral transition-colors">
            로그인
          </Link>
          <span className="text-hairline">|</span>
          <Link href="/auth/signup" className="text-body-md font-semibold text-coral hover:text-coral-active transition-colors">
            가입
          </Link>
        </div>
      </nav>

      {/* Mobile Header - 56px */}
      <nav className="md:hidden flex items-center justify-between h-[56px] px-md">
        {/* Logo */}
        <Link href="/" className="text-title-sm font-semibold text-ink">
          free_traveler
        </Link>

        {/* Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-11 w-11 items-center justify-center text-ink hover:text-coral transition-colors"
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-nav-menu" className="md:hidden border-t border-hairline bg-surface-soft">
          <div className="flex flex-col py-md px-md gap-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-md text-body hover:text-coral transition-colors py-xs"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-hairline pt-md mt-md flex gap-md">
              <Link href="/auth/login" className="flex-1 text-center text-body-md text-body hover:text-coral transition-colors py-xs">
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 text-center text-body-md font-semibold text-coral hover:text-coral-active transition-colors py-xs"
              >
                가입
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
