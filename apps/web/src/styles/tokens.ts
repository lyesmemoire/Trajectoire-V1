export const colors = {
  background: {
    base: "#0B0F1A",
    surface: "#111827",
    elevated: "#1F2937",
    glass: "rgba(255,255,255,0.03)",
  },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    strong: "rgba(255,255,255,0.12)",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    muted: "#64748B",
  },
  accent: {
    primary: "#6366F1",
    secondary: "#A78BFA",
  },
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
}

export const typography = {
  display: {
    fontFamily: "Satoshi, Geist, Inter",
    fontSize: 64,
    fontWeight: 600,
    letterSpacing: -0.02,
    lineHeight: 1.1,
  },
  h1: {
    fontFamily: "Satoshi, Geist, Inter",
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: -0.015,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 28,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  body: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.6,
  },
  mono: {
    fontFamily: "JetBrains Mono",
    fontSize: 14,
  },
}

export const motion = {
  fast: 150,
  base: 200,
  slow: 400,
  reveal: 800,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
}
