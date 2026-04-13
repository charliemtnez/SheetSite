/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
        serif: ['"EB Garamond"', "serif"],
      },
      colors: {
        primary: { DEFAULT: "#173e38", light: "#4a7368" },
        accent: { DEFAULT: "#e9bc50", hover: "#b89e60" },
        charcoal: "#262626",
        cream: "#f8f5f2",
        sand: "#f5f5f3",
        mist: "#eceae7",
      },
    },
  },
  plugins: [],
};
