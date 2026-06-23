import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },

      // ═══════════════════════════════════════════
      // PALETTE — Design tokens
      // ═══════════════════════════════════════════
      colors: {
        // Brand
        brand: {
          primary: "#1A3C34",
          "primary-hover": "#142E28",
          "primary-light": "#2D5F50",
          accent: "#E8501A",
          "accent-hover": "#D04415",
          "accent-light": "#F87850",
        },

        // Sémantique
        success: {
          DEFAULT: "#1A7F4B",
          light: "rgba(26,127,75,0.12)",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "rgba(217,119,6,0.12)",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "rgba(220,38,38,0.12)",
        },

        // Surfaces
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8F9",
          dark: "#0A0A0A",
          "dark-muted": "#1F1F1F",
        },

        // Bordures
        border: {
          DEFAULT: "#E2E8E4",
          subtle: "rgba(226,232,228,0.5)",
          dark: "rgba(255,255,255,0.1)",
        },

        // Texte
        ink: {
          DEFAULT: "#0A0A0A",
          muted: "#4A4A4A",
          subtle: "#6B7280",
          inverse: "#FFFFFF",
        },

        // Glassmorphism overlays
        glass: {
          "primary-08": "rgba(26,60,52,0.08)",
          "primary-12": "rgba(26,60,52,0.12)",
          "primary-06": "rgba(26,60,52,0.06)",
          "accent-08": "rgba(232,80,26,0.08)",
          "accent-12": "rgba(232,80,26,0.12)",
          "accent-15": "rgba(232,80,26,0.15)",
          "white-06": "rgba(255,255,255,0.06)",
          "white-08": "rgba(255,255,255,0.08)",
          "white-12": "rgba(255,255,255,0.12)",
        },
      },

      // ═══════════════════════════════════════════
      // TYPOGRAPHIE — Échelle fluide
      // ═══════════════════════════════════════════
      fontSize: {
        // Display (titres énormes)
        "display-1": ["clamp(40px, 4.5vw, 64px)", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-2": ["clamp(32px, 3.5vw, 52px)", { lineHeight: "1.1", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-3": ["clamp(24px, 2.5vw, 36px)", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],

        // Heading (titres standards)
        "heading-1": ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-2": ["22px", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-3": ["18px", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],

        // Body
        "body-lg": ["18px", { lineHeight: "1.65" }],
        "body": ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.55" }],

        // Util
        "caption": ["13px", { lineHeight: "1.5" }],
        "micro": ["11px", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },

      // ═══════════════════════════════════════════
      // SPACING — Système 4px
      // ═══════════════════════════════════════════
      spacing: {
        "18": "4.5rem",   // 72px
        "22": "5.5rem",   // 88px
        "30": "7.5rem",   // 120px
      },

      // ═══════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════
      borderRadius: {
        "2xl": "1rem",       // 16px
        "3xl": "1.5rem",     // 24px
        "4xl": "2rem",       // 32px
        "5xl": "2.5rem",     // 40px
      },

      // ═══════════════════════════════════════════
      // SHADOWS — Hiérarchie d'élévation
      // ═══════════════════════════════════════════
      boxShadow: {
        "soft": "0 2px 8px rgba(0,0,0,0.05)",
        "card": "0 4px 16px rgba(0,0,0,0.07)",
        "elevated": "0 8px 32px rgba(0,0,0,0.10)",
        "hero": "0 24px 64px rgba(0,0,0,0.14)",
        "focus-primary": "0 0 0 3px rgba(26,60,52,0.15)",
        "focus-accent": "0 0 0 3px rgba(232,80,26,0.20)",
        "glow-primary": "0 0 60px rgba(26,60,52,0.12)",
        "glow-accent": "0 8px 24px rgba(232,80,26,0.30)",
        "glow-accent-strong": "0 12px 32px rgba(232,80,26,0.40)",
      },

      // ═══════════════════════════════════════════
      // CONTAINER MAX-WIDTH
      // ═══════════════════════════════════════════
      maxWidth: {
        "container": "1400px",
        "container-narrow": "1100px",
        "container-prose": "768px",
      },

      // ═══════════════════════════════════════════
      // BREAKPOINTS
      // ═══════════════════════════════════════════
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },

      // ═══════════════════════════════════════════
      // ANIMATIONS
      // ═══════════════════════════════════════════
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
