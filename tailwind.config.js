/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'media', // media 브라우저 모드 따라감 class => 클래스 추가하면 바뀜
  plugins: [require('@tailwindcss/forms')],
};
