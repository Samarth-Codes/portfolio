/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#00ffff',
        background: '#0a0a0a',
        'card-background': '#1a1a1a',
        'text-primary': '#ffffff',
        'text-secondary': '#aaaaaa',
        'border-color': '#00ffff',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
        'body': ['Space Grotesk', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'flicker': 'flicker 5s infinite linear',
        'glitch': 'glitch-anim 2.5s infinite linear alternate-reverse',
        'fade-in-down': 'fade-in-down 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 1s ease-out 0.5s forwards',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff'
          },
          '50%': { 
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff'
          }
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' }
        },
        'glitch-anim': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-0.05em, 0.025em)' },
          '40%': { transform: 'translate(-0.025em, -0.05em)' },
          '60%': { transform: 'translate(0.05em, -0.01em)' },
          '80%': { transform: 'translate(0.01em, 0.025em)' },
          '100%': { transform: 'translate(0)' }
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'neon-pulse': {
          '0%': {
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
          },
          '100%': {
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
          }
        },
        'glow-pulse': {
          '0%': {
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3)'
          },
          '100%': {
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.8), 0 0 25px rgba(0, 255, 255, 0.5)'
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

