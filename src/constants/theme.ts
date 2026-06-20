// ─── Medicire Design Tokens ──────────────────────────────────────────────────
// Single source of truth extracted from Figma designs.
// All colors, spacing, typography, and radii live here.

export const Colors = {
  // Primary Brand
  primary: '#0b8f81',
  primaryDark: '#097a6e',
  primaryDarker: '#065f56',
  primaryLight: '#e6f5f3',
  primaryMid: '#0d9e8f',

  // Backgrounds
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textDisabled: '#d1d5db',
  textInverse: '#ffffff',

  // Border
  border: '#e5e7eb',
  borderLight: '#f3f4f6',

  // Status
  success: '#16a34a',
  successLight: '#f0fdf4',
  successBorder: '#bbf7d0',

  warning: '#d97706',
  warningLight: '#fffbeb',
  warningBorder: '#fde68a',

  error: '#dc2626',
  errorLight: '#fef2f2',
  errorBorder: '#fecaca',

  info: '#2563eb',
  infoLight: '#eff6ff',
  infoBorder: '#bfdbfe',

  // Neutrals
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Map Pin Colors
  pinInStock: '#22c55e',
  pinLowStock: '#f59e0b',
  pinOutOfStock: '#ef4444',
  pinClosed: '#9ca3af',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

export const FontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extrabold: 'PlusJakartaSans-ExtraBold',
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeight = {
  tight: 16,
  snug: 18,
  normal: 20,
  relaxed: 22,
  loose: 28,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// Z-index scale
export const ZIndex = {
  base: 0,
  card: 10,
  nav: 40,
  modal: 50,
  toast: 60,
  statusBar: 100,
} as const;

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  fontSize: FontSize,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  lineHeight: LineHeight,
  shadow: Shadow,
  zIndex: ZIndex,
} as const;

export type ThemeColors = keyof typeof Colors;
