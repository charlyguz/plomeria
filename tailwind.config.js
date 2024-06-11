/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#34495E',
        'secondary': '#6E7AD9',
      }
    }
  },
  plugins: [],
}