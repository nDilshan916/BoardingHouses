/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "blue-gradient": "var(--blue-gradient)",
        "green-gradient": "var(--green-gradient)",
      },
    },
  },
  plugins: [],
};
