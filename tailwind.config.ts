import type { Config } from 'tailwindcss';

/**
 * Free Traveler Tailwind Configuration
 * Design tokens from design-reference/D-001/DESIGN.md (LOCKED)
 * REQ-NF-006,023
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        'surface-soft': '#F7F7F8',
        'surface-strong': '#F0F0F2',
        hairline: '#E4E4E8',
        'hairline-soft': '#EFEFF2',
        'border-strong': '#C7C7CE',
        ink: '#2A2A2E',
        body: '#4B4B50',
        muted: '#767680',
        'muted-soft': '#9B9BA3',
        coral: '#FF6B4A',
        'coral-active': '#E5502F',
        'coral-disabled': '#FFD9CC',
        'on-coral': '#FFFFFF',
        danger: '#C4351A',
        warning: '#B8720A',
        info: '#2557C7',
        success: '#1E8A5F',
      },
      fontFamily: {
        base: "'Inter', 'Pretendard Variable', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      },
      fontSize: {
        'display-xl': ['32px', { lineHeight: '1.25', letterSpacing: '-0.2px', fontWeight: '700' }],
        'display-lg': ['26px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['21px', { lineHeight: '1.35', letterSpacing: '0', fontWeight: '600' }],
        'title-md': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'title-sm': ['16px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'button-md': ['16px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        link: ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        'section-desktop-min': '64px',
        'section-desktop-max': '96px',
        'section-mobile-min': '40px',
        'section-mobile-max': '64px',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
      },
      boxShadow: {
        floating: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
