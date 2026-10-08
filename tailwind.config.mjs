/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fff8d6',
          DEFAULT: '#ffc400',
          dark: '#b88900',
        },
        sidebar: {
          bg: '#111827',
          hover: '#1f2937',
          text: '#e5e7eb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
