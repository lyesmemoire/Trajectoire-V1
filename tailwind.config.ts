import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        // Official Trajectoire Design System Colors
        background: {
          DEFAULT: "#f8fafc", // slate-50
        },
        surface: {
          DEFAULT: "#f8fafc", // slate-50
          secondary: "#ffffff",
          elevated: "#ffffff",
        },
        primary: {
          DEFAULT: "#38bdf8", // sky-400
          hover: "#0ea5e9", // sky-500
          soft: "#f0f9ff", // sky-50
          light: "rgba(56, 189, 248, 0.08)",
          lighter: "rgba(56, 189, 248, 0.04)",
        },
        secondary: {
          DEFAULT: "#34d399", // emerald-400
          hover: "#10b981", // emerald-500
          light: "rgba(52, 211, 153, 0.08)",
          lighter: "rgba(52, 211, 153, 0.04)",
        },
        text: {
          primary: "#1e293b", // slate-800
          secondary: "#475569", // slate-600
          muted: "#94a3b8", // slate-400
          tertiary: "rgba(17, 24, 39, 0.4)",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#e2e8f0", // slate-200
          hover: "rgba(17, 24, 39, 0.12)",
          focus: "#38bdf8", // sky-400
        },
        success: {
          DEFAULT: "#16A34A",
          light: "rgba(22, 163, 74, 0.08)",
          lighter: "rgba(22, 163, 74, 0.04)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "rgba(245, 158, 11, 0.08)",
          lighter: "rgba(245, 158, 11, 0.04)",
        },
        danger: {
          DEFAULT: "#F59E0B", // Danger is now Amber as per Phase 4.2 specs
          light: "rgba(245, 158, 11, 0.08)",
          lighter: "rgba(245, 158, 11, 0.04)",
        },
        info: {
          DEFAULT: "#2563EB",
          light: "rgba(37, 99, 235, 0.08)",
          lighter: "rgba(37, 99, 235, 0.04)",
        },
        // Legacy brand colors (kept for backward compatibility)
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      borderRadius: {
        none: "0",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        card: "24px",
        button: "16px",
        dialog: "24px",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
        sm: "0 2px 4px rgba(0, 0, 0, 0.04)",
        md: "0 4px 12px rgba(0, 0, 0, 0.06)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.08)",
        xl: "0 20px 40px rgba(0, 0, 0, 0.12)",
        "2xl": "0 32px 64px rgba(0, 0, 0, 0.16)",
        focus: "0 0 0 4px rgba(15, 118, 110, 0.1)",
        focusRing: "0 0 0 3px rgba(15, 118, 110, 0.1)",
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.04)",
        none: "none",
        // Semantic shadows
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.03)",
        medium: "0 10px 30px -4px rgba(0, 0, 0, 0.05)",
        floating: "0 20px 40px -8px rgba(0, 0, 0, 0.08)",
        // Colored shadows
        "primary": "0 8px 24px rgba(56, 189, 248, 0.15)",
        "primary-hover": "0 12px 32px rgba(56, 189, 248, 0.2)",
        "secondary": "0 8px 24px rgba(52, 211, 153, 0.15)",
        "secondary-hover": "0 12px 32px rgba(52, 211, 153, 0.2)",
        "success": "0 8px 24px rgba(16, 185, 129, 0.15)",
        "warning": "0 8px 24px rgba(245, 158, 11, 0.15)",
        "danger": "0 8px 24px rgba(245, 158, 11, 0.15)",
        "info": "0 8px 24px rgba(37, 99, 235, 0.15)",
        // Legacy shadows (kept for backward compatibility)
        card: "0 1px 3px 0 rgba(17, 24, 39, 0.08), 0 1px 2px -1px rgba(17, 24, 39, 0.04)",
        elevated: "0 4px 6px -1px rgba(17, 24, 39, 0.08), 0 2px 4px -2px rgba(17, 24, 39, 0.04)",
        premium: "0 8px 30px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        // Official Trajectoire Design System Animations
        fade: "fadeIn 0.3s ease-out forwards",
        "fade-up": "fadeInUp 0.5s ease-out forwards",
        "fade-down": "fadeInDown 0.5s ease-out forwards",
        "fade-left": "fadeInLeft 0.5s ease-out forwards",
        "fade-right": "fadeInRight 0.5s ease-out forwards",
        scale: "scaleIn 0.3s ease-out forwards",
        zoom: "zoomIn 0.5s ease-out forwards",
        drawer: "drawerIn 0.3s ease-out forwards",
        modal: "modalIn 0.3s ease-out forwards",
        toast: "toastIn 0.3s ease-out forwards",
        skeleton: "skeleton 1.5s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        // Legacy animations (kept for backward compatibility)
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "scale-out": "scaleOut 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        // Official Trajectoire Design System Keyframes
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeOutUp: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-20px)" },
        },
        fadeInDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeOutDown: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(20px)" },
        },
        fadeInLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeOutLeft: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-20px)" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeOutRight: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(20px)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        zoomIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        zoomOut: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.9)" },
        },
        drawerIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        drawerOut: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        modalIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        modalOut: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        toastOut: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(20px)" },
        },
        skeleton: {
          "0%, 100%": { backgroundPosition: "200% 0" },
          "50%": { backgroundPosition: "-200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        // Legacy keyframes (kept for backward compatibility)
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionDuration: {
        fast: "200ms",
        normal: "400ms",
        slow: "700ms",
        verySlow: "1200ms",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
