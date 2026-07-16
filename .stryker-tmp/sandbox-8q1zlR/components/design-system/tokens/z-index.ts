/**
 * Trajectoire Design System - Z-Index Tokens
 * Official z-index scale for layering
 */
// @ts-nocheck


export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  overlay: 1090,
  skipLink: 9999,
} as const;

export const zIndexScale = [1000, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 9999] as const;

export type ZIndexToken = typeof zIndex;
