/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecf5ff',
          100: '#d9eaff',
          200: '#b0d0ff',
          300: '#85b4ff',
          400: '#3f82ff',
          500: '#1d5fe6',
          600: '#1649b4',
          700: '#103483',
          800: '#0a2152',
          900: '#040d21',
        },
      },
    },
  },
  plugins: [],
}
