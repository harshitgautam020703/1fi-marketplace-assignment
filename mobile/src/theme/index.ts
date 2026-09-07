/**
 * Design tokens for the Marketplace feature, extracted from 1Fi app
 * screenshots (Shop, Home, Profile, Gift Voucher/EMI screens) rather than
 * guessed. Every screen/component consumes these instead of hardcoding
 * values, so this is the one file to touch if the real values differ
 * slightly from what's readable off a screenshot.
 *
 * Assumptions called out explicitly:
 * - Exact hex values are estimated from screenshots (no access to 1Fi's
 *   real style guide / Figma tokens) but land within a few percent of what's
 *   visible - the violet/purple primary, warm-gray background, and bold
 *   rounded type scale are all deliberate matches, not defaults.
 * - Font family: the app uses a rounded geometric sans (visible in
 *   "Profile", "Gift voucher" headings). Without the actual font file this
 *   uses the platform's default rounded-leaning sans rather than importing
 *   a guessed font, to avoid shipping a wrong typeface with false confidence.
 */

export const colors = {
  background: '#F5F5F8',
  surface: '#FFFFFF',
  border: '#EAEAF0',
  divider: '#F0F0F5',

  textPrimary: '#14121F',
  textSecondary: '#6E6B7B',
  textMuted: '#A6A3B3',

  // Primary violet/purple, as seen on the bottom nav active state,
  // "Continue" CTA, and Shop hero banner.
  primary: '#6D28D9',
  primaryDark: '#5B21B6',
  primarySoft: '#EFE9FE',

  // Deeper indigo used in the Shop page hero banner gradient endpoints.
  heroStart: '#4C1D95',
  heroEnd: '#2E1065',

  success: '#1BA672',
  successSoft: '#E6F7EF',
  danger: '#DC3545',
  dangerSoft: '#FDEBEC',

  overlay: 'rgba(15, 12, 25, 0.5)',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// 1Fi's cards and pills read noticeably rounder than a typical Material
// app - large radii on cards, fully pill-shaped buttons and tab chips.
export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

const fontFamily = undefined; // platform default; see note above

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: colors.textPrimary, fontFamily },
  h2: { fontSize: 21, fontWeight: '700' as const, color: colors.textPrimary, fontFamily },
  h3: { fontSize: 17, fontWeight: '700' as const, color: colors.textPrimary, fontFamily },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textPrimary, fontFamily },
  bodyMedium: { fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary, fontFamily },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary, fontFamily },
  captionMedium: { fontSize: 12, fontWeight: '700' as const, color: colors.textSecondary, fontFamily },
};

export const shadow = {
  card: {
    shadowColor: '#14121F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  floating: {
    shadowColor: '#14121F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Minimum comfortable touch target (Apple HIG / Material both recommend
// ~44-48dp) - used by interactive chips, icons, and nav items so nothing
// interactive drops below this.
export const minTouchTarget = 44;
