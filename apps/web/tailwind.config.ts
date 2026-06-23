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
      colors: {
        background: "#FFFFFF",
        surface:    "#F7F8F9",
        primary: {
          DEFAULT: "#1A3C34",
          hover:   "#142E28",
          light:   "#2D5F50",
        },
        accent: {
          DEFAULT: "#E8501A",
          hover:   "#D04415",
        },
        brand: {
          text:    "#0A0A0A",
          muted:   "#4A4A4A",
          border:  "#E2E8E4",
          success: "#1A7F4B",
          warning: "#D97706",
        },
      },
      screens: {
        xs:   "375px",
        sm:   "640px",
        md:   "768px",
        lg:   "1024px",
        xl:   "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
