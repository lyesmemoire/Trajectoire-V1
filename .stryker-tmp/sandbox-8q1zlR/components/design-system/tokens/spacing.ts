/**
 * Trajectoire Design System - Spacing Tokens
 * Official spacing scale (8px grid system)
 */
// @ts-nocheck


export const spacing = {
  0: '0',
  1: '4px',   // 0.25rem
  2: '8px',   // 0.5rem
  3: '12px',  // 0.75rem
  4: '16px',  // 1rem
  5: '20px',  // 1.25rem
  6: '24px',  // 1.5rem
  7: '28px',  // 1.75rem
  8: '32px',  // 2rem
  9: '36px',  // 2.25rem
  10: '40px', // 2.5rem
  11: '44px', // 2.75rem
  12: '48px', // 3rem
  14: '56px', // 3.5rem
  16: '64px', // 4rem
  20: '80px', // 5rem
  24: '96px', // 6rem
  28: '112px', // 7rem
  32: '128px', // 8rem
  36: '144px', // 9rem
  40: '160px', // 10rem
  48: '192px', // 12rem
  56: '224px', // 14rem
  64: '256px', // 16rem
  72: '288px', // 18rem
  80: '320px', // 20rem
  96: '384px', // 24rem
} as const;

export const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

export type SpacingToken = typeof spacing;
