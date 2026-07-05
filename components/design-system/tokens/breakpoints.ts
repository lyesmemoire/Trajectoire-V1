/**
 * Trajectoire Design System - Breakpoint Tokens
 * Official responsive breakpoints
 */

export const breakpoints = {
  xs: '375px',   // Extra small mobile
  sm: '640px',   // Small mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

export const breakpointScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export const containers = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

export type BreakpointToken = typeof breakpoints;
export type ContainerToken = typeof containers;
