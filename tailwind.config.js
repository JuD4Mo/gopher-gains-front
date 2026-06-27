/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: { sidebar: '15rem' },
      colors: {
        accent: '#3DB8FF',
        'accent-dark': '#1AA0E8',
        'accent-light': '#7DD3FC',
        'accent-dim': 'rgba(61,184,255,0.12)',
        success: '#2DA44E',
        'success-dim': 'rgba(45,164,78,0.12)',
        warning: '#E3A008',
        'warning-dim': 'rgba(227,160,8,0.12)',
        danger: '#CF222E',
        'danger-dim': 'rgba(207,34,46,0.12)',
        muscle: {
          chest: { bg: 'rgba(207,34,46,0.12)', text: '#FF7B7B' },
          back:  { bg: 'rgba(130,80,255,0.12)', text: '#B794F4' },
          legs:  { bg: 'rgba(61,184,255,0.12)', text: '#7DD3FC' },
          arms:  { bg: 'rgba(227,160,8,0.12)',  text: '#F6C90E' },
          delts: { bg: 'rgba(45,164,78,0.12)',  text: '#56D364' },
          abs:   { bg: 'rgba(61,184,255,0.08)', text: '#3DB8FF' },
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card':       '0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4)',
        'modal':      '0 20px 60px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':  'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
