import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background), 1)",
        foreground: "rgba(var(--foreground), 1)",
        primary: {
          50: '#eef3f8',
          100: '#dce6f1',
          200: '#b9cde4',
          300: '#95b4d7',
          400: '#729bc9',
          500: '#4f82bc',
          600: '#0a66c2', // LinkedIn Primary
          700: '#004182', // LinkedIn Dark
          800: '#002b56',
          900: '#00152b',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#6b21a8'
        },
        surface: "rgba(var(--surface), <alpha-value>)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px 2px rgba(10, 102, 194, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 25px 0px rgba(0, 212, 255, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
