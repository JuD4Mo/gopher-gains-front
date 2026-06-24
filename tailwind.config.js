/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        sidebar: '15rem',
      },
      colors: {
        // Go cyan — primary accent
        accent: '#00ACD7',
        'accent-dark': '#0090B8',
        'accent-light': '#33C4E8',
        'accent-dim': 'rgba(0,172,215,0.12)',

        // Secondary: Go warm slate
        slate: {
          go: '#5B6B7C',
        },

        // Dark mode surface tokens
        'dark-base':      '#0D1117',
        'dark-surface':   '#161B22',
        'dark-card':      '#1C2230',
        'dark-card-hover':'#212840',
        'dark-border':    '#2A3347',
        'dark-text':      '#E6EDF3',
        'dark-muted':     '#7D8FA8',
        'dark-sidebar':   '#111827',
        'dark-sidebar-hover': '#1E2A3A',

        // Light mode surface tokens
        'light-base':     '#F0F4F8',
        'light-surface':  '#FFFFFF',
        'light-card':     '#FFFFFF',
        'light-card-hover':'#F7FAFC',
        'light-border':   '#D1DCE8',
        'light-text':     '#0D1117',
        'light-muted':    '#627080',
        'light-sidebar':  '#0D1117',
        'light-sidebar-hover': '#1A2535',

        // Semantic colors
        success: '#2DA44E',
        'success-dim': 'rgba(45,164,78,0.12)',
        warning: '#E3A008',
        'warning-dim': 'rgba(227,160,8,0.12)',
        danger:  '#CF222E',
        'danger-dim': 'rgba(207,34,46,0.12)',

        // Muscle group palette (dark-friendly)
        muscle: {
          chest: { bg: 'rgba(207,34,46,0.12)', text: '#FF7B7B' },
          back:  { bg: 'rgba(130,80,255,0.12)', text: '#B794F4' },
          legs:  { bg: 'rgba(0,172,215,0.12)',  text: '#63D4F5' },
          arms:  { bg: 'rgba(227,160,8,0.12)',  text: '#F6C90E' },
          delts: { bg: 'rgba(45,164,78,0.12)',  text: '#56D364' },
          abs:   { bg: 'rgba(0,172,215,0.08)',  text: '#00ACD7' },
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card':          '0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover':    '0 4px 16px rgba(0,0,0,0.35)',
        'accent-glow':   '0 0 12px rgba(0,172,215,0.35)',
        'accent-glow-sm':'0 0 6px rgba(0,172,215,0.25)',
        'modal':         '0 20px 60px rgba(0,0,0,0.6)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in':   'fadeIn 0.15s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
