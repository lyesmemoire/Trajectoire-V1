/**
 * Design tokens as JavaScript constants.
 * Use these in inline styles instead of hardcoded rgba() values.
 * All values are derived from globals.css CSS variables.
 */

export const T = {
  /* Solid colors */
  primary:      "#1A3C34",
  primaryHover: "#142E28",
  primaryLight: "#2D5F50",
  accent:       "#E8501A",
  accentHover:  "#D04415",
  text:         "#0A0A0A",
  muted:        "#4A4A4A",
  border:       "#E2E8E4",
  success:      "#1A7F4B",
  warning:      "#D97706",
  background:   "#FFFFFF",
  surface:      "#F7F8F9",

  /* Primary with opacity */
  primary8:   "rgba(26,60,52,0.08)",
  primary10:  "rgba(26,60,52,0.10)",
  primary12:  "rgba(26,60,52,0.12)",
  primary15:  "rgba(26,60,52,0.15)",
  primary20:  "rgba(26,60,52,0.20)",
  primary30:  "rgba(26,60,52,0.30)",

  /* Accent with opacity */
  accent8:    "rgba(232,80,26,0.08)",
  accent10:   "rgba(232,80,26,0.10)",
  accent15:   "rgba(232,80,26,0.15)",
  accent20:   "rgba(232,80,26,0.20)",
  accent30:   "rgba(232,80,26,0.30)",

  /* Success with opacity */
  success10:  "rgba(26,127,75,0.10)",
  success12:  "rgba(26,127,75,0.12)",
  success15:  "rgba(26,127,75,0.15)",

  /* Warning with opacity */
  warning10:  "rgba(217,119,6,0.10)",
  warning15:  "rgba(217,119,6,0.15)",

  /* Neutral */
  border30:   "rgba(226,232,228,0.3)",
  border50:   "rgba(226,232,228,0.5)",
  border60:   "rgba(226,232,228,0.6)",

  /* White with opacity (for dark backgrounds) */
  white10:    "rgba(255,255,255,0.10)",
  white20:    "rgba(255,255,255,0.20)",
  white40:    "rgba(255,255,255,0.40)",
  white50:    "rgba(255,255,255,0.50)",
  white60:    "rgba(255,255,255,0.60)",
  white70:    "rgba(255,255,255,0.70)",

  /* Surface tinted */
  surface4:   "rgba(247,248,249,0.8)",
  surface6:   "rgba(26,60,52,0.04)",
  surface8:   "rgba(26,60,52,0.06)",
} as const;
