/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-green": '#03a884',
        "dark-green": '#038069',
        "dark-green-hover": "#027562",
        "white-font": '#fdfefe',
        "main-background": '#e4e3de',
      }
    },
  },
  plugins: [],
}

