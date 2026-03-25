# Chartedly Design Tokens

Complete token system for Chartedly. All values are implementation-ready.

---

## CSS Custom Properties

```css
:root {
  /* ========================================
     COLORS — Background
     ======================================== */
  --color-bg-base: #0A0A0F;
  --color-bg-deep: #0D0D18;
  --color-bg-charcoal: #1A1A2E;
  --color-bg-gradient: linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%);

  /* ========================================
     COLORS — Surface
     ======================================== */
  --color-surface-card: #16162A;
  --color-surface-elevated: #1E1E38;
  --color-surface-overlay: rgba(22, 22, 42, 0.95);
  --color-surface-hover: #1C1C36;
  --color-surface-pressed: #141428;
  --color-surface-input: #12122A;

  /* ========================================
     COLORS — Primary Accent (Electric Blue)
     ======================================== */
  --color-primary-50: #EBF0FE;
  --color-primary-100: #C8D6FD;
  --color-primary-200: #A5BBFC;
  --color-primary-300: #82A1FB;
  --color-primary-400: #6890F9;
  --color-primary: #4F7DF7;
  --color-primary-600: #3D65D4;
  --color-primary-700: #2D4EB1;
  --color-primary-800: #1E388E;
  --color-primary-900: #10236B;

  /* ========================================
     COLORS — Secondary Accent (Warm Amber)
     ======================================== */
  --color-secondary-50: #FEF5EB;
  --color-secondary-100: #FDE5C8;
  --color-secondary-200: #FBD4A5;
  --color-secondary-300: #F9C382;
  --color-secondary-400: #F9B668;
  --color-secondary: #F7A94F;
  --color-secondary-600: #D48E3D;
  --color-secondary-700: #B1742D;
  --color-secondary-800: #8E5A1E;
  --color-secondary-900: #6B4110;

  /* ========================================
     COLORS — Score System
     ======================================== */
  --color-score-excellent: #22C55E;       /* 80-100 */
  --color-score-excellent-bg: rgba(34, 197, 94, 0.12);
  --color-score-good: #F59E0B;            /* 60-79 */
  --color-score-good-bg: rgba(245, 158, 11, 0.12);
  --color-score-poor: #EF4444;            /* 0-59 */
  --color-score-poor-bg: rgba(239, 68, 68, 0.12);

  /* ========================================
     COLORS — Text
     ======================================== */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #9CA3AF;
  --color-text-tertiary: #6B7280;
  --color-text-disabled: #4B5563;
  --color-text-inverse: #0A0A0F;
  --color-text-link: #4F7DF7;
  --color-text-link-hover: #6890F9;

  /* ========================================
     COLORS — Border
     ======================================== */
  --color-border-subtle: #2D2D4A;
  --color-border-default: #3D3D5C;
  --color-border-strong: #4D4D6A;
  --color-border-focus: #4F7DF7;

  /* ========================================
     COLORS — Semantic
     ======================================== */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #4F7DF7;

  /* ========================================
     TYPOGRAPHY — Font Families
     ======================================== */
  --font-family-en: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-jp: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* ========================================
     TYPOGRAPHY — Font Sizes
     ======================================== */
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 3rem;       /* 48px */
  --font-size-6xl: 3.75rem;    /* 60px */

  /* ========================================
     TYPOGRAPHY — Font Weights
     ======================================== */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ========================================
     TYPOGRAPHY — Line Heights
     ======================================== */
  --line-height-tight: 1.2;      /* Headings */
  --line-height-normal: 1.5;     /* Body EN */
  --line-height-relaxed: 1.6;    /* Body JP */
  --line-height-loose: 1.8;      /* Large body JP */

  /* ========================================
     TYPOGRAPHY — Letter Spacing
     ======================================== */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.02em;
  --letter-spacing-wider: 0.04em;
  --letter-spacing-caps: 0.08em;

  /* ========================================
     SPACING — 4px Grid
     ======================================== */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* ========================================
     BORDER RADIUS
     ======================================== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ========================================
     SHADOWS
     ======================================== */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-card-hover: 0 8px 32px rgba(79, 125, 247, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 12px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-overlay: 0 24px 64px rgba(0, 0, 0, 0.6);
  --shadow-score-glow-green: 0 0 12px rgba(34, 197, 94, 0.3);
  --shadow-score-glow-amber: 0 0 12px rgba(245, 158, 11, 0.3);
  --shadow-score-glow-red: 0 0 12px rgba(239, 68, 68, 0.3);
  --shadow-focus-ring: 0 0 0 3px rgba(79, 125, 247, 0.4);

  /* ========================================
     TRANSITIONS
     ======================================== */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-carousel: 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-shimmer: 1.5s ease-in-out infinite;
  --transition-page: 200ms ease-out;

  /* ========================================
     Z-INDEX SCALE
     ======================================== */
  --z-base: 0;
  --z-card: 1;
  --z-card-hover: 2;
  --z-sticky: 10;
  --z-nav: 100;
  --z-dropdown: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;

  /* ========================================
     BREAKPOINTS (reference only — use Tailwind)
     ======================================== */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;

  /* ========================================
     LAYOUT
     ======================================== */
  --content-max-width: 1440px;
  --content-padding-x: var(--space-6);         /* 24px default */
  --content-padding-x-mobile: var(--space-4);  /* 16px mobile */
  --nav-height: 64px;
  --nav-height-mobile: 56px;
  --bottom-tab-height: 56px;
  --card-min-width: 280px;
  --card-max-width: 360px;
  --carousel-gap: var(--space-4);              /* 16px */
}
```

---

## Tailwind CSS Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0A0F',
          deep: '#0D0D18',
          charcoal: '#1A1A2E',
        },
        surface: {
          card: '#16162A',
          elevated: '#1E1E38',
          hover: '#1C1C36',
          pressed: '#141428',
          input: '#12122A',
        },
        primary: {
          50: '#EBF0FE',
          100: '#C8D6FD',
          200: '#A5BBFC',
          300: '#82A1FB',
          400: '#6890F9',
          DEFAULT: '#4F7DF7',
          600: '#3D65D4',
          700: '#2D4EB1',
          800: '#1E388E',
          900: '#10236B',
        },
        secondary: {
          50: '#FEF5EB',
          100: '#FDE5C8',
          200: '#FBD4A5',
          300: '#F9C382',
          400: '#F9B668',
          DEFAULT: '#F7A94F',
          600: '#D48E3D',
          700: '#B1742D',
          800: '#8E5A1E',
          900: '#6B4110',
        },
        score: {
          excellent: '#22C55E',
          good: '#F59E0B',
          poor: '#EF4444',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          disabled: '#4B5563',
          inverse: '#0A0A0F',
        },
        border: {
          subtle: '#2D2D4A',
          DEFAULT: '#3D3D5C',
          strong: '#4D4D6A',
          focus: '#4F7DF7',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        jp: ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],       // 12px
        sm: ['0.875rem', { lineHeight: '1.5' }],      // 14px
        base: ['1rem', { lineHeight: '1.5' }],        // 16px
        lg: ['1.125rem', { lineHeight: '1.5' }],      // 18px
        xl: ['1.25rem', { lineHeight: '1.5' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.2' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '1.2' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '1.2' }],    // 60px
      },
      spacing: {
        1: '0.25rem',    // 4px
        2: '0.5rem',     // 8px
        3: '0.75rem',    // 12px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        8: '2rem',       // 32px
        10: '2.5rem',    // 40px
        12: '3rem',      // 48px
        16: '4rem',      // 64px
        20: '5rem',      // 80px
        24: '6rem',      // 96px
        32: '8rem',      // 128px
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 32px rgba(79, 125, 247, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3)',
        elevated: '0 12px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
        overlay: '0 24px 64px rgba(0, 0, 0, 0.6)',
        'focus-ring': '0 0 0 3px rgba(79, 125, 247, 0.4)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        carousel: '400ms',
      },
      transitionTimingFunction: {
        carousel: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      zIndex: {
        card: '1',
        'card-hover': '2',
        sticky: '10',
        nav: '100',
        dropdown: '200',
        overlay: '300',
        modal: '400',
        toast: '500',
        tooltip: '600',
      },
      maxWidth: {
        content: '1440px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'score-fill': {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--score-offset)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'score-fill': 'score-fill 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
    },
  },
  plugins: [],
};
```
