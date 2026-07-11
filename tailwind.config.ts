import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf6',
          100: '#d5f9e6',
          200: '#aef1d0',
          300: '#75e3b3',
          400: '#3ecd91',
          500: '#1ab074',
          600: '#0f8f5e',
          700: '#0f724d',
          800: '#115a3f',
          900: '#0f4a35',
          950: '#062a1d',
        },
        ink: {
          50: '#f5f6f7',
          100: '#e6e8eb',
          200: '#c9ced4',
          300: '#a1a9b3',
          400: '#78818d',
          500: '#5c6470',
          600: '#48505a',
          700: '#3a4149',
          800: '#292d33',
          900: '#191c20',
          950: '#0d0f11',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 6px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
