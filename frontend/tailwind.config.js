/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#722F37',
          deep: '#541A21',
          light: '#8E3D47',
          dark: '#3E1016',
          50: '#FDF7F7',
          100: '#F9EDED',
          200: '#F1D4D6',
          300: '#E4B2B6',
          400: '#CE838A',
          500: '#722F37',
          600: '#642930',
          700: '#522026',
          800: '#431B20',
          900: '#38171B',
        },
        ivory: {
          DEFAULT: '#FAF6F0',
          light: '#FFFDF9',
          warm: '#F4ECE1',
        },
        beige: {
          DEFAULT: '#D4C5A9',
          light: '#EFE7DB',
          dark: '#B8A585',
        },
        gold: {
          DEFAULT: '#C5A572',
          light: '#DFCA9E',
          dark: '#9A7D4E',
          royal: '#D4AF37',
        },
        charcoal: {
          DEFAULT: '#1A1A2E',
          soft: '#25253A',
          deep: '#0F0F1B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 10px 30px -10px rgba(114, 47, 55, 0.15)',
        'card': '0 4px 20px -2px rgba(26, 26, 46, 0.06)',
        'elevated': '0 20px 40px -15px rgba(26, 26, 46, 0.12)',
      },
      aspectRatio: {
        'portrait': '3/4',
      },
    },
  },
  plugins: [],
}
