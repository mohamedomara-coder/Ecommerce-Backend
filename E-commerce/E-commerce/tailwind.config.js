/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A1628',
        accent: '#F59E0B',
        surface: '#FAFAF8',
        success: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        bounceBadge: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        drawCheck: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 600ms ease forwards',
        fadeIn: 'fadeIn 400ms ease forwards',
        scaleIn: 'scaleIn 500ms ease forwards',
        kenBurns: 'kenBurns 8s ease-in-out infinite alternate',
        marquee: 'marquee 30s linear infinite',
        bounceBadge: 'bounceBadge 300ms ease',
        shimmer: 'shimmer 2s infinite linear',
        slideInRight: 'slideInRight 300ms ease forwards',
        slideOutRight: 'slideOutRight 300ms ease forwards',
        drawCheck: 'drawCheck 600ms ease forwards',
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};
