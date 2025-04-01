/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1281px',

      '2xl': '1536px',
    },
    backgroundImage: {
      scenario1: "url('../public/scenario_1.png')",
      scenario2: "url('../public/scenario_2.png')",
      scenario3: "url('../public/scenario_3.png')",
      scenario4: "url('../public/scenario_4.png')",
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-5%)',
          'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
        },
      },
      pulse: {
        '0% , 100%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.5,
        },
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: 0,
        },
      },
    },
    extend: {
      fontSize: {
        'body-xl': '100%',
        'body-lg': '75%',
        'body-md': '75%',
        body: '70%',
        system: [{ lineHeight: '0px' }],
        system_medium: [{ lineHeight: '0px' }],
        system_semibold: [{ lineHeight: '0px' }],
        system_bold: [{ lineHeight: '0px' }],
        system_bold2: [{ lineHeight: '0px' }],
        system_extraBold: [{ lineHeight: '0px' }],
      },
      fontFamily: {
        system: ['Pretendard Variable'],
        system_medium: ['Pretendard Variable'],
        system_semibold: ['Pretendard Variable'],
        system_bold: ['Pretendard Variable'],
        system_bold2: ['Pretendard Variable'],
        system_extraBold: ['Pretendard Variable'],
      },
      fontWeight: {
        system: ['400'],
        system_medium: ['500'],
        system_semibold: ['600'],
        system_bold: ['700'],
        system_bold2: ['800'],
        system_extraBold: ['900'],
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      colors: {
        primary: '#203A65',
        yuppie: '#98D3E2',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/line-clamp'),
  ],
};
