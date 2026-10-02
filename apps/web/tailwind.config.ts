import type { Config } from "tailwindcss"

/**
 * Design system « Calm » (ambiance Sauge). Les valeurs vivent dans `src/app/globals.css` (variables CSS) ;
 * ce fichier ne fait que les exposer à Tailwind.
 *
 * - `calm.*` : la palette, à utiliser pour tout nouveau composant (`bg-calm-bg`, `text-calm-ink`,
 *   `border-calm-line`, `bg-calm-accent`…). Les opacités fonctionnent (`text-calm-ink/80`).
 * - jetons sémantiques (`bg-background`, `text-foreground`, `bg-surface`, `border-border`, `bg-primary`…) :
 *   historiques, recalés sur la palette Calm.
 * - échelles héritées (`primary-*`, `ivoire`, `ink`, `bronze`, `violet`, `terracotta`, `forest`, `brick`) :
 *   conservées pour ne pas casser les composants non migrés, mais **remappées sur la palette Calm** (plus aucune
 *   couleur violette ni rouge vif). Ne pas les utiliser dans du nouveau code.
 * - pas de mode sombre : `darkMode: "class"` est laissé tel quel, aucune classe `dark` n'est jamais posée.
 */
const calm = (name: string) => `rgb(var(--calm-${name}) / <alpha-value>)`
const sem = (name: string) => `hsl(var(--${name}) / <alpha-value>)`

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette Calm
        calm: {
          bg: calm("bg"),
          alt: calm("alt"),
          rule: calm("rule"),
          field: calm("field"),
          "on-accent": calm("on-accent"),
          "on-accent-2": calm("on-accent-2"),
          "on-accent-mark": calm("on-accent-mark"),
          focus: calm("focus"),
          surface: calm("surface"),
          line: calm("line"),
          "line-soft": calm("line-soft"),
          ink: calm("ink"),
          secondary: calm("secondary"),
          tertiary: calm("tertiary"),
          accent: calm("accent"),
          "accent-deep": calm("accent-deep"),
          "accent-soft": calm("accent-soft"),
          "accent-wash": calm("accent-wash"),
          "accent-line": calm("accent-line"),
          warn: calm("warn"),
          "warn-soft": calm("warn-soft"),
          "warn-line": calm("warn-line"),
          input: calm("input"),
        },

        // Jetons sémantiques (HSL, recalés sur Calm)
        background: sem("background"),
        foreground: {
          DEFAULT: sem("foreground"),
          muted: sem("foreground-muted"),
        },
        surface: {
          DEFAULT: sem("surface"),
          muted: sem("surface-muted"),
        },
        border: sem("border"),
        input: sem("input"),
        ring: sem("ring"),
        success: sem("success"),
        warning: sem("warning"),
        danger: sem("danger"),
        info: sem("info"),
        card: { DEFAULT: sem("card"), foreground: sem("card-foreground") },
        popover: { DEFAULT: sem("popover"), foreground: sem("popover-foreground") },
        secondary: { DEFAULT: sem("secondary"), foreground: sem("secondary-foreground") },
        muted: { DEFAULT: sem("muted"), foreground: sem("muted-foreground") },
        destructive: { DEFAULT: sem("destructive"), foreground: sem("destructive-foreground") },
        accent: {
          DEFAULT: sem("accent"),
          foreground: sem("accent-foreground"),
        },

        // Échelles héritées, remappées sur la palette Calm (plus de violet).
        primary: {
          50: "#F1F7F3", // accent-wash
          100: "#E3EFE9", // accent-soft
          200: "#B9D3C8", // accent-line
          300: "#8DB5A5",
          400: "#5F917F",
          500: "#3F7D6D",
          600: "#2F6B5E", // accent
          700: "#245247", // accent-deep
          800: "#1B3F37",
          900: "#122B25",
          light: sem("primary-light"),
          DEFAULT: sem("primary"),
          foreground: sem("primary-foreground"),
        },
        violet: {
          50: "#F1F7F3",
          100: "#E3EFE9",
          200: "#B9D3C8",
          300: "#8DB5A5",
          400: "#5F917F",
          500: "#3F7D6D",
          600: "#2F6B5E",
          700: "#245247",
          800: "#1B3F37",
          900: "#122B25",
        },
        ivoire: {
          50: "#FAFAF8", // fond
          100: "#F5F5F1",
          200: "#E6E4DE", // bordure
          300: "#D6D3CB",
        },
        ink: {
          900: "#1F2A37", // encre
          800: "#1F2A37",
          700: "#3F4855", // tertiaire
          600: "#4B5563", // secondaire
          500: "#4B5563",
          400: "#6B7280",
          200: "#E6E4DE",
        },
        bronze: {
          50: "#F1F7F3",
          100: "#E3EFE9",
          400: "#2F6B5E",
          500: "#2F6B5E",
          600: "#245247",
          700: "#245247",
        },
        terracotta: {
          50: "#FBF3E8", // warn-soft
          100: "#E8D2B4", // warn-line
          600: "#8A4B16", // warn
          700: "#8A4B16",
        },
        forest: {
          50: "#F1F7F3",
          100: "#E3EFE9",
          600: "#2F6B5E",
        },
        brick: {
          50: "#FBF3E8",
          100: "#E8D2B4",
          600: "#8A4B16",
        },
      },
      fontFamily: {
        sans: ["var(--font-dmsans)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        accent: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
      },
      // Titres fluides : clamp(min, préféré, max).
      fontSize: {
        "calm-display": ["clamp(2.25rem, 1.4rem + 3.6vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "calm-h1": ["clamp(1.875rem, 1.3rem + 2.4vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "calm-h2": ["clamp(1.5rem, 1.15rem + 1.4vw, 2.125rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "calm-h3": ["clamp(1.125rem, 1rem + 0.5vw, 1.375rem)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      // Plus d'ombres, sauf le portrait et la carte du rapport. Les noms historiques restent (sans effet) pour que
      // les écrans existants suivent sans retouche.
      boxShadow: {
        premium: "none",
        "premium-lg": "none",
        "premium-inset": "none",
        subtle: "none",
        elevated: "none",
        calm: "none",
        portrait: "0 24px 60px -24px rgba(22, 27, 25, 0.35)",
        report: "0 18px 50px -24px rgba(22, 27, 25, 0.22)",
      },
      // Rayons Calm : 4 à 6 px partout.
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-md)",
        xl: "var(--radius-lg)",
        "2xl": "var(--radius-xl)",
        "3xl": "var(--radius-xl)",
        xl2: "var(--radius-lg)",
        "calm-md": "6px",
        "calm-lg": "6px",
        "calm-xl": "6px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
}

export default config
