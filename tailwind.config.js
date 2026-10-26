/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0D0D0D",
        panel: "#161616",
        chalk: "#EDEAE3",
        mute: "#8B877F",
        edge: "#2A2A2A",
        saffron: "#FFB547",
        // postcard
        card: "#FBF8F1",
        ink: "#161616",
        red: "#E5432D",
        blue: "#2E5BE6",
        green: "#18A05E",
      },
      fontFamily: {
        sans: ['"Archivo"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        hand: ['"Caveat"', "cursive"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
