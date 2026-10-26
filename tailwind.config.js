/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        18: 'repeat(18, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-16': 'span 16 / span 16',
        'span-10': 'span 10 / span 10',
      },
    },
  },
  plugins: [],
};
