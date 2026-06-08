/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Poppins", "serif"],
        outfit: ["Outfit", "serif"],
      }, 
      colors: {
        primary: "#0F79DE",
        secondary: "#0066CC",
        sidebar: "#418FDE",
        neutral: "#263133",
        background: "#F9F9FA",
        grayText: "#6A7282",
        dark: "#4A5565",
        gray: "#E5E7EB",
      },
    },
  },
  plugins: [],
};
