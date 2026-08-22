/**
 * Trajectoire Design System - Main Tokens Export
 * Central export for all design tokens
 */

export { colors, type ColorToken } from './colors';
export { typography, type TypographyToken } from './typography';
export { spacing, spacingScale, type SpacingToken } from './spacing';
export { radius, radiusScale, type RadiusToken } from './radius';
export { shadows, coloredShadows, type ShadowToken, type ColoredShadowToken } from './shadows';
export { motion, type MotionToken } from './motion';
export { breakpoints, breakpointScale, containers, type BreakpointToken, type ContainerToken } from './breakpoints';
export { zIndex, zIndexScale, type ZIndexToken } from './z-index';

// Re-export all tokens as a single object
export const tokens = {
  colors: {
    background: '#F8F6F3',
    surface: '#FFFFFF',
    primary: '#0F766E',
    primaryHover: '#115E59',
    secondary: '#C89B3C',
    secondaryHover: '#B8860B',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    info: '#2563EB',
  },
  spacing: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  radius: [4, 8, 12, 16, 20, 24],
  shadows: ['xs', 'sm', 'md', 'lg', 'xl'],
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
  zIndex: [1000, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 9999],
} as const;

export type Tokens = typeof tokens;
