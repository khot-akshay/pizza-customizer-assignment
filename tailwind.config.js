/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff6b35',
          dark: '#d94f1b',
        },
        surface: '#f8f9fd',
      },
      boxShadow: {
        card: '0 15px 35px -15px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
