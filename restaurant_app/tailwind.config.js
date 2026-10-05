/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Sage x Cream Palette (Soft • Natural • Elegant)
        sage: {
          DEFAULT: "#A3B18A",
          50: "#F4F6F2",
          100: "#E7ECE0",
          200: "#D3DDC7",
          300: "#BCCBAC",
          400: "#A3B18A",
          500: "#809267",
          600: "#588157",
          700: "#3A5A40",
          800: "#2D4532",
          900: "#1C2D23",
          950: "#121C16",
        },
        cream: {
          DEFAULT: "#F2E8CF",
          50: "#FDFBF7",
          100: "#FAF7EE",
          200: "#F2E8CF",
          300: "#E6D8B5",
          400: "#D9C699",
          500: "#CBB37E",
          600: "#B89D63",
          700: "#947C4B",
          800: "#6F5C37",
          900: "#4B3D24",
        },
        forest: {
          DEFAULT: "#344E41",
          dark: "#283618",
          deep: "#1C241B",
        },

        // Theme Primary: Rich Sage & Deep Forest Green
        primary: "#3A5A40",
        "primary-container": "#588157",
        "on-primary": "#F2E8CF",
        "on-primary-container": "#FFFFFF",
        "coral-orange": "#3A5A40", // Replaced with Sage Green

        // Warm Accent (Earthy Honey)
        tertiary: "#BC6C25",
        "tertiary-container": "#F2E8CF",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#603813",

        // Secondary: Forest Dark
        secondary: "#344E41",
        "secondary-container": "#E7ECE0",
        "on-secondary": "#F2E8CF",
        "on-secondary-container": "#1C2D23",

        // Warm Cream Surfaces & Backgrounds
        surface: "#FAF7EE",
        background: "#FAF7EE",
        "surface-bright": "#FFFFFF",
        "surface-dim": "#F4EFE6",
        "surface-variant": "#EFE9DC",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#FAF7EE",
        "surface-container": "#F2E8CF",
        "surface-container-high": "#E7DCBF",
        "surface-container-highest": "#DDD0AF",
        "on-surface": "#1C241B",
        "on-surface-variant": "#434E42",
        "on-background": "#1C241B",
        outline: "#828F7E",
        "outline-variant": "#DCD5C3",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        sans: ["'Hanken Grotesk'", "sans-serif"],
        headline: ["'Playfair Display'", "serif"],
        playfair: ["'Playfair Display'", "serif"],
        serif: ["'Noto Serif'", "serif"]
      }
    },
  },
  plugins: [],
}
