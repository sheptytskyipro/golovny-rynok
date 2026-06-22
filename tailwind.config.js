/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#15120F',
        'bg-elevated': '#1C1814',
        'accent-orange': '#F4801A',
        'accent-yellow': '#F5C518',
        'accent-green': '#7CB342',
        'text-primary': '#F5EFE6',
        'text-secondary': 'rgba(245,239,230,0.64)',
        'text-tertiary': 'rgba(245,239,230,0.38)',
      },
      fontFamily: {
        sans: ['-apple-system', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'btn': '18px',
        'sheet': '28px',
        'chip': '100px',
      },
      backdropBlur: { glass: '24px' },
    },
  },
  plugins: [],
}
