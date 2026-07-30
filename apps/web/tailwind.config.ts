import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivoire: {
          50: '#FBF9F6',
          100: '#F5F2EC',
          200: '#E7E2DB',
          300: '#D6CFC3',
        },
        ink: {
          900: '#1C1917',
          800: '#292524',
          700: '#3A3532',
          600: '#57534E',
          400: '#A8A29E',
          200: '#E7E2DB',
        },
        bronze: {
          50: '#F9F3E9',
          100: '#F0E4CC',
          400: '#C9A75D',
          500: '#B4903F',
          600: '#A67C3D',
          700: '#8B6529',
        },
        terracotta: {
          50: '#FBF0EA',
          100: '#F0D9CC',
          600: '#B7472A',
          700: '#9C3A21',
        },
        forest: {
          50: '#F0F5F1',
          100: '#CDE0D1',
          600: '#2F6844',
        },
        brick: {
          50: '#FAEEEE',
          100: '#EBCFCF',
          600: '#9B2C2C',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 24px -4px rgba(28, 25, 23, 0.08)',
        'premium-lg': '0 16px 48px -8px rgba(28, 25, 23, 0.14)',
        'premium-inset': 'inset 0 0 0 1px rgba(28, 25, 23, 0.06)',
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
