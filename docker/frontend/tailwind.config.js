module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2C2C2C',
          600: '#3D3D3D',
        },
        red: {
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};