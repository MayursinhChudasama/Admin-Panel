/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        blue: "#70b1f7",
        sky: "#aecbeb",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
