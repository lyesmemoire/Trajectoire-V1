/**
 * Trajectoire Design System - Shadow Tokens
 * Official shadow scale for elevation
 */

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
  xl: '0 20px 40px rgba(0, 0, 0, 0.12)',
  '2xl': '0 32px 64px rgba(0, 0, 0, 0.16)',
  focus: '0 0 0 4px rgba(15, 118, 110, 0.1)',
  focusRing: '0 0 0 3px rgba(15, 118, 110, 0.1)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
  none: 'none',
} as const;

export const coloredShadows = {
  primary: {
    DEFAULT: '0 8px 24px rgba(15, 118, 110, 0.15)',
    hover: '0 12px 32px rgba(15, 118, 110, 0.2)',
  },
  secondary: {
    DEFAULT: '0 8px 24px rgba(200, 155, 60, 0.15)',
    hover: '0 12px 32px rgba(200, 155, 60, 0.2)',
  },
  success: {
    DEFAULT: '0 8px 24px rgba(22, 163, 74, 0.15)',
  },
  warning: {
    DEFAULT: '0 8px 24px rgba(245, 158, 11, 0.15)',
  },
  danger: {
    DEFAULT: '0 8px 24px rgba(220, 38, 38, 0.15)',
  },
  info: {
    DEFAULT: '0 8px 24px rgba(37, 99, 235, 0.15)',
  },
} as const;

export type ShadowToken = typeof shadows;
export type ColoredShadowToken = typeof coloredShadows;
