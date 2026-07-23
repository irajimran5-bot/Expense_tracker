/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['"Plus Jakarta Sans"','sans-serif'],
      },
      colors:{
        brand: {
           50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed', 
          700: '#6d28d9',
        },
        cyanAccent:{
          500:'#06b6d4',
          600: '#0891b2',
        }
      }
    },
  },
  plugins: [],
}

