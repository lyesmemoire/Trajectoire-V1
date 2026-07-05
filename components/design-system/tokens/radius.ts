/**
 * Trajectoire Design System - Border Radius Tokens
 * Official border radius scale
 */

export const radius = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

export const radiusScale = [4, 8, 12, 16, 20, 24] as const;

export type RadiusToken = typeof radius;
