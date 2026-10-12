/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#060808',
        surface: '#0A0C0E',
        surfaceCard: '#121619',
        border: '#22272B',
        brand: {
          teal: '#00E599',
          cyan: '#38BDF8',
          amber: '#E5A93C',
          red: '#EF4444',
          gray: '#98A0A8',
          text: '#F5F5F2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

