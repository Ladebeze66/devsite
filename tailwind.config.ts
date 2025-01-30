import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        exo2: ['Exo 2', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
