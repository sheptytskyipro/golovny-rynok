/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apple-green': '#7CB342',
        'orange-accent': '#F4801A',
        'honey-yellow': '#F5C518',
        'warm-dark': '#2A2418',
        'warm-bg-start': '#FFF3E0',
        'warm-bg-end': '#F1F8E9',
      },
      backdropBlur: {
        'glass': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
