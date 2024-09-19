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
        "green-message-bubble": "#DCF8C6",
        "white-font": '#fdfefe',
        "main-background": '#e4e3de',
        "color-sidebar": '#202b33',
        "menu-chats-background": '#111a21',
        "item-menu-selected": '#2a3942',
        "clipboard-background": '#0c151c',
        "text-background": '#005c4b',
      }
    },
  },
  plugins: [],
}

