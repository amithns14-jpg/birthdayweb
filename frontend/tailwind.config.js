/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        birthday: {
          dark: '#0D0714',
          night: '#170B26',
          card: 'rgba(255, 255, 255, 0.08)',
          cardBorder: 'rgba(255, 255, 255, 0.15)',
          pink: '#F472B6',
          softPink: '#FCE7F3',
          roseGold: '#FDA4AF',
          gold: '#FBBF24',
          lavender: '#C084FC',
          purple: '#7E22CE',
          deepPurple: '#3B0764'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Great Vibes"', 'cursive', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(244, 114, 182, 0.4), 0 0 30px rgba(192, 132, 252, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(244, 114, 182, 0.8), 0 0 50px rgba(192, 132, 252, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        floatSlow: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}
