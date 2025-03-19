import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./lib/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#ebfffc',
          100: '#cdfffb',
          200: '#a1fffa',
          300: '#60fff9',
          400: '#18f8f4',
          500: '#00dede',
          600: '#00adb5',
          700: '#088c96',
          800: '#10707a',
          900: '#125d67',
          950: '#053e47',
        },
        'secondary': {
          50: '#f8f8f8',
          100: '#eeeeee',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3d3d3d',
          950: '#292929',
        },
      }
    },
  },
  plugins: [],
})
