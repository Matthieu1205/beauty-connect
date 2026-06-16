/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          900: '#3D0E1C', 800: '#511325', 700: '#6E1E33', 600: '#872A42',
        },
        gold: { 500: '#C9A24B', 400: '#D7B968', 300: '#E7D29A' },
        cream: { DEFAULT: '#FBF7F1', 2: '#F4ECE0' },
        ink: '#2A141A',
        line: '#E6D9CB',
        muted: '#7C6A6F',
      },
      fontFamily: {
        sans: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: { xl2: '28px' },
      boxShadow: {
        soft: '0 14px 40px rgba(61,14,28,.12)',
        gold: '0 12px 30px rgba(201,162,75,.28)',
      },
    },
  },
  plugins: [],
}
