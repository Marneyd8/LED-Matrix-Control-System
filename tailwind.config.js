/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/Frontend/index.html",
    "./apps/Frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#30d6a6',
        main_dark: '#246c5c',
        second: '#1f2228'
      },
    },
  },
  plugins: [],
}
