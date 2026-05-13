/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c3e50',
          light: '#34495e',
          dark: '#1a252f',
        },
        accent: {
          DEFAULT: '#f39c12',
          light: '#f5b041',
          dark: '#d68910',
        },
        background: '#faf9f7',
        text: '#2d3436',
        success: '#00b894',
        danger: '#e74c3c',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
