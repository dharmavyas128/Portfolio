/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#0a0a0b',
        bone: '#f4f1ea',
        gold: '#c9a35e',
      },
      letterSpacing: {
        luxe: '0.18em',
      },
    },
  },
  plugins: [],
}
