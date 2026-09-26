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
        trinity: {
          bg: '#0B0C10',        // Deep Black background
          card: '#1F2833',      // Dark slate card surface
          cyan: '#66FCF1',      // Primary Accent: Neon Cyan (Buy/Success)
          emerald: '#10B981',   // Secondary Success: Emerald
          amber: '#F59E0B',     // Warning / Veto / Alert
          red: '#EF4444',       // Danger / Sell / Error
          text: '#E2E8F0',      // Slate 200 (Primary text)
          muted: '#94A3B8',     // Slate 400 (Secondary text)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(102, 252, 241, 0.25)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.25)',
      },
    },
  },
  plugins: [],
};
