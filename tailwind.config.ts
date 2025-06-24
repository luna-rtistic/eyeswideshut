import type { Config } from 'tailwindcss'
const { fontFamily } = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-roboto-mono)', ...fontFamily.mono],
        sans: ['var(--font-roboto)', ...fontFamily.sans],
      },
      keyframes: {
        'flicker-glitch': {
          '0%, 100%': { 
            color: '#00FF2F',
            textShadow: '0 0 5px #00FF2F, 0 0 10px #00FF2F'
          },
          '50%': { 
            color: 'white',
            textShadow: '0 0 5px white, 0 0 10px white'
           },
        },
      },
      animation: {
        'flicker-glitch': 'flicker-glitch 0.5s step-end infinite',
      },
    },
  },
  plugins: [],
}
export default config 