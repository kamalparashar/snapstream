/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': {'min': '300px', 'max': '426px'},

      'md': {'min': '426px', 'max': '1023px'},

      'lg': {'min': '1024px', 'max': '1279px'},

      'xl': {'min': '1279px', 'max': '1535px'},

      '2xl': {'min': '1536px'},
    },
  },
  plugins: [],
}