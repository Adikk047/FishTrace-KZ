/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#eff8ff',
          100: '#dff0ff',
          200: '#b7e2ff',
          300: '#76ceff',
          400: '#2db8ff',
          500: '#069ef0',
          600: '#007dcb',
          700: '#0063a4',
          800: '#045487',
          900: '#0a4670',
          950: '#072d4a',
        },
        tide: {
          50:  '#f0fdf6',
          100: '#dcfcec',
          200: '#bbf7d8',
          300: '#87edba',
          400: '#4cdb94',
          500: '#22c272',
          600: '#159f5a',
          700: '#147d49',
          800: '#14633b',
          900: '#125232',
          950: '#072e1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
