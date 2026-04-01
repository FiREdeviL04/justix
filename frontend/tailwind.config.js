/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#dc2626",
          700: "#b91c1c",
          900: "#111111",
        },
        accent: {
          500: "#1f1f1f",
          700: "#0a0a0a",
        },
      },
      boxShadow: {
        soft: "0 16px 40px -18px rgba(220, 38, 38, 0.22)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 700ms ease-out both",
      },
    },
  },
  plugins: [],
};
