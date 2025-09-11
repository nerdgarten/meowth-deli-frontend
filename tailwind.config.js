/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-brown": "#685B4B",
        "app-background": "#FEECC4",
        "app-yellow": "#FFC052",
        "app-tan": "#CCAD98",
      },
    },
  },
  plugins: [],
};

export default config;
