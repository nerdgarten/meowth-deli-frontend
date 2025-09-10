/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-brown": "#685B4B",
      },
    },
  },
  plugins: [],
};

export default config;
