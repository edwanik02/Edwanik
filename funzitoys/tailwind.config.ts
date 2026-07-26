import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-jakarta)', 'sans-serif'], serif: ['var(--font-playfair)', 'serif'] },
      colors: { brand: { 50: '#FFF2EC', 100: '#FFE0CC', 500: '#FF6B35', 600: '#D94F1E', 700: '#B33A14' } },
      borderRadius: { '2xl': '14px', '3xl': '20px' },
      animation: { 'slide-up': 'slideUp 0.25s ease', 'fade-in': 'fadeIn 0.2s ease' },
      keyframes: {
        slideUp: { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
