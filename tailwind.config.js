/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cambridge: {
          light: '#DAE6E0',
          DEFAULT: '#A3C1AD',
          dark: '#7A9B86',
        }
      }
    },
  },
  plugins: [],
}
