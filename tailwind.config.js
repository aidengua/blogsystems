/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        // Semantic Colors
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        overlay: 'var(--bg-overlay)',
        main: 'var(--text-main)',
        muted: 'var(--text-muted)',
        highlight: 'var(--text-highlight)',

        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#8AB3F5', // Lighter shade of #709CEF
          500: '#709CEF', // Main color
          600: '#5A86D9', // Darker shade for hover
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        butterfly: {
          bg: 'var(--bg-base)',
          text: 'var(--text-main)',
          card: 'var(--bg-surface)',
          darkCard: 'var(--bg-surface)', // Unified to surface
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Lato', 'Roboto', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Titillium Web"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-in-out',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
