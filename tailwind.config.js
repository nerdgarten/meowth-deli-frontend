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
        "app-bronze": "#A67244",
        "restaurant-font": "#FCB438",
        "customer-font": "#FF5B32",
        "driver-font": "#50D0FF",
      },
    },
  },
  plugins: [],
};

export default config;
