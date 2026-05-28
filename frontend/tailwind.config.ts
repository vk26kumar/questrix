import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8471A',
          hover: '#D63D15',
        },
        btn: {
          dark: '#181818',
          light: '#FFFFFF',
        },
        text: {
          primary: '#303030',
          secondary: '#6B6B6B',
          muted: '#9B9B9B',
        },
        bg: {
          app: '#EFEFEF',
          card: '#FFFFFF',
          'card-75': 'rgba(255,255,255,0.75)',
          'form-card': 'rgba(255,255,255,0.50)',
          textarea: 'rgba(255,255,255,0.25)',
          'off-white': '#F6F6F6',
          'output-wrap': '#5E5E5E',
          'ai-banner': '#181818',
          'nav-mobile': '#181818',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.20)',
          dashed: '#DADADA',
        },
        status: {
          green: '#22C55E',
          orange: '#E8471A',
          red: '#FF4444',
          'delete-red': '#FF3B30',
        },
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'Inter', 'sans-serif'],
      },

      fontSize: {
        'xs': ['12px', { lineHeight: '140%', letterSpacing: '-0.02em' }],
        'sm': ['13px', { lineHeight: '140%', letterSpacing: '-0.02em' }],
        'base': ['14px', { lineHeight: '140%', letterSpacing: '-0.04em' }],
        'md': ['16px', { lineHeight: '140%', letterSpacing: '-0.02em' }],
        'lg': ['18px', { lineHeight: '130%', letterSpacing: '-0.02em' }],
        'xl': ['20px', { lineHeight: '130%', letterSpacing: '-0.02em' }],
        '2xl': ['22px', { lineHeight: '120%', letterSpacing: '-0.02em' }],
        '3xl': ['24px', { lineHeight: '120%', letterSpacing: '-0.02em' }],
      },

      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '999px',
        'circle': '100px',
      },

      boxShadow: {
        'card': '0 32px 48px rgba(0,0,0,0.20), 0 16px 48px rgba(0,0,0,0.12)',
        'dropdown': '0 32px 48px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.20)',
        'inner-white': 'inset 0 0 12.6px rgba(255,255,255,0.10)',
      },

      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },

      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;