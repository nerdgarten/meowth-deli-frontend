/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-brown": "#685B4B",
        "app-background": "#FEECC4",
        "primary": "#685B4B",
        "secondary": "#FFC052",
        "tertiary": "#CCAD98",
      },
    },
  },
  plugins: [],
};

export default config;
