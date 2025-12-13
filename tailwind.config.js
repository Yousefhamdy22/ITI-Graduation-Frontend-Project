module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Blue Palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary Blue
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Accent colors
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#6366f1',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(37, 99, 235, 0.08)',
        'card': '0 4px 16px rgba(37, 99, 235, 0.12)',
        'lg-blue': '0 10px 25px rgba(37, 99, 235, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-light': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      addUtilities({
        '.rtl': {
          direction: 'rtl'
        },
        '.ltr': {
          direction: 'ltr'
        }
      })
    }
  ]
}
