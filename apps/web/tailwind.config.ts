import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          400: '#A78BFA',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
        },
        ivoire: {
          50: '#FAFAFF',
          100: '#F7F7FB',
          200: '#E9E5F5',
          300: '#DDD6FE',
        },
        ink: {
          900: '#18181B',
          800: '#1E1B4B',
          700: '#3A3532',
          600: '#71717A',
          400: '#A8A29E',
          200: '#E9E5F5',
        },
        bronze: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        terracotta: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
        },
        brick: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 24px -4px rgba(30, 27, 75, 0.08)',
        'premium-lg': '0 16px 48px -8px rgba(30, 27, 75, 0.14)',
        'premium-inset': 'inset 0 0 0 1px rgba(30, 27, 75, 0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
