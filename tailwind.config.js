/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1f",
          900: "#0d1526",
          800: "#111c33",
          700: "#182642",
        },
        gold: {
          400: "#f5b942",
          500: "#eea62a",
          600: "#d98f1a",
        },
        offwhite: "#faf8f4",
        charcoal: "#2a2a2a",
        teal: {
          400: "#38c9b9",
          500: "#22a99b",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(10, 15, 31, 0.08)",
        glow: "0 0 0 1px rgba(238,166,42,0.15), 0 12px 40px -12px rgba(238,166,42,0.35)",
        "glow-lg": "0 0 0 1px rgba(238,166,42,0.12), 0 30px 80px -20px rgba(238,166,42,0.3)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
