// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: 'var(--ifm-color-primary-dark)',
          darker: 'var(--ifm-color-primary-darker)',
          darkest: 'var(--ifm-color-primary-darkest)',
          DEFAULT: 'var(--ifm-color-primary)',
          light: 'var(--ifm-color-primary-light)',
          lighter: 'var(--ifm-color-primary-lighter)',
          lightest: 'var(--ifm-color-primary-lightest)',
        },
        t: {
          main: '#A175FF',
        },
      },
    },
    backgroundImage: (theme) => ({
      grad: 'linear-gradient(76.03deg, rgba(10, 117, 255, 0) 0%, rgba(255, 117, 255, 0.5) 19.01%, rgba(120, 117, 255, 0) 45.83%, rgba(120, 117, 255, 0.4) 73.44%, rgba(120, 117, 255, 0.25) 100%)',
      grad2:
        'linear-gradient(76.03deg, rgba(120, 117, 255, 0) 0%, rgba(120, 117, 255, 0.5) 19.01%, rgba(120, 117, 255, 0) 45.83%, rgba(120, 117, 255, 0.4) 73.44%, rgba(120, 117, 255, 0.25) 100%)',
    }),
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [require('@tailwindcss/line-clamp')],
};
