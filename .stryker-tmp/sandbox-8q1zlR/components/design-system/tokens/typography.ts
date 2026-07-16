/**
 * Trajectoire Design System - Typography Tokens
 * Official typography scale for the application
 */
// @ts-nocheck


export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  // Font Sizes
  fontSize: {
    displayXL: ['clamp(48px, 6vw, 72px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    displayL: ['clamp(40px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    displayM: ['clamp(32px, 4vw, 40px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    heading1: ['clamp(28px, 4vw, 36px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    heading2: ['clamp(24px, 3vw, 30px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    heading3: ['clamp(20px, 3vw, 24px)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
    heading4: ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
    bodyLarge: ['18px', { lineHeight: '1.7', letterSpacing: '0' }],
    body: ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
    bodySmall: ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
    caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
    button: ['15px', { lineHeight: '1.4', letterSpacing: '0' }],
    label: ['14px', { lineHeight: '1.4', letterSpacing: '0' }],
  },
  
  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.1',
    normal: '1.5',
    relaxed: '1.7',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
} as const;

export type TypographyToken = typeof typography;
