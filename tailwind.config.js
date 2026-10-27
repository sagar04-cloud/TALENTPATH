/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',         // Rich modern dark slate/navy
          navyDark: '#090D16',     // Deep contrast
          navyLight: '#1E293B',
          blue: '#4F46E5',         // Vibrant royal indigo/purple from reference
          blueHover: '#4338CA',    // Deep indigo hover
          blueLight: '#EEF2FF',    // Soft lavender/indigo pill background
          blueMuted: '#818CF8',    // Soft violet accent
          darkText: '#0F172A',     // High contrast headline text
          bodyText: '#475569',     // Modern slate body
          mutedText: '#64748B',    // Muted labels
          bgLight: '#F8FAFC',      // Ultra clean light canvas from reference
          cardBg: '#FFFFFF',
          borderLight: '#E2E8F0',  // Subtle modern borders
          accentEmerald: '#10B981',
          accentAmber: '#F59E0B',
          purple: '#6366F1',
          purpleLight: '#F5F3FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)',
        'soft': '0 10px 30px -10px rgba(79, 70, 229, 0.08), 0 4px 16px -2px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 20px 45px -15px rgba(15, 23, 42, 0.08), 0 10px 25px -8px rgba(79, 70, 229, 0.06)',
        'pill': '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
        'pill-hover': '0 6px 20px 0 rgba(79, 70, 229, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        shimmer: 'shimmer 2.8s infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
