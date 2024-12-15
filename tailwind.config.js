/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': {'min': '310px', 'max': '426px'}, //mobiles

      'md': {'min': '426px', 'max': '769px'},  //tablets

      'lg': {'min': '770px', 'max': '1025px'}, //laptops

      'xl' : {'min': '1026px', 'max': '1441px'},  //desktops

      '2xl': {'min': '1442px'}  //large-screens
    },
  },
  plugins: [],
}