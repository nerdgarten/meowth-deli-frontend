/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-dark-brown": "#403831",
        "app-brown": "#685B4B",
        "app-background": "#FEECC4",
        "app-yellow": "#FFC052",
        "app-tan": "#CCAD98",
        "app-white": "#FFFCF8",
      },
    },
  },
  plugins: [],
};

export default config;
