/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce3fd',
          300: '#c2cffc',
          400: '#a1b3fa',
          500: '#7a8ff7',
          600: '#5d6ef2',
          700: '#4a58e3',
          800: '#3e49c7',
          900: '#363fa0',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#5d6ef2',
              '&:hover': {
                color: '#4a58e3',
              },
            },
            strong: {
              color: 'inherit',
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
          },
        },
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  safelist: [
    'bg-gradient-to-br',
    'from-primary-50',
    'to-white',
    'from-green-50',
    'to-green-100/50',
    'from-yellow-50',
    'to-yellow-100/50',
    'from-gray-50',
    'to-gray-100/50',
    'border-primary-100',
    'border-green-200/50',
    'border-yellow-200/50',
    'border-gray-200/50',
    'text-primary-500',
    'text-green-700',
    'text-yellow-700',
    'text-gray-700',
    'group-hover:translate-x-0.5',
    'group-hover:translate-y-0.5',
    'group-hover:-translate-y-0.5',
    'group-hover:scale-110',
  ],
  plugins: [forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
