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

        // --- Design tokens Stitch "Digital Atelier" (voir docs-site-interne/REFONTE-VISUELLE.md)
        // Primaire : indigo-ardoise, pour CTAs, accents, headlines.
        primary: "#26445d",
        "primary-container": "#3e5c76",
        "on-primary": "#ffffff",
        "on-primary-container": "#b5d4f2",
        "primary-fixed": "#cce5ff",
        "primary-fixed-dim": "#abcae8",
        "on-primary-fixed": "#001d31",
        "on-primary-fixed-variant": "#2b4963",
        "inverse-primary": "#abcae8",

        // Secondaire : neutres chauds intermédiaires (sous-titres, meta).
        secondary: "#516169",
        "secondary-container": "#d2e2ec",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#55656d",
        "secondary-fixed": "#d5e5ef",
        "secondary-fixed-dim": "#b9c9d3",
        "on-secondary-fixed": "#0e1d25",
        "on-secondary-fixed-variant": "#3a4951",

        // Tertiaire : utilisé ponctuellement (citations, anecdotes).
        tertiary: "#334453",
        "tertiary-container": "#4a5b6b",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#c1d2e5",
        "tertiary-fixed": "#d3e4f7",
        "tertiary-fixed-dim": "#b7c8db",
        "on-tertiary-fixed": "#0b1d2b",
        "on-tertiary-fixed-variant": "#384858",

        // Surfaces : empilement tonal façon "sheets of vellum".
        surface: "#f8fafa",
        "surface-bright": "#f8fafa",
        "surface-dim": "#d8dada",
        "surface-variant": "#e1e3e3",
        "surface-tint": "#43617c",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f4",
        "surface-container": "#eceeee",
        "surface-container-high": "#e6e8e9",
        "surface-container-highest": "#e1e3e3",
        "inverse-surface": "#2e3131",
        "inverse-on-surface": "#eff1f1",

        // Textes : jamais de #000000, on-surface est la teinte la plus sombre.
        "on-surface": "#191c1d",
        "on-surface-variant": "#42474d",
        "on-background": "#191c1d",

        // Outline : 15 % d'opacité max sur les "ghost borders", jamais plein.
        outline: "#73777d",
        "outline-variant": "#c3c7cd",

        // Erreurs.
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      screens: {
        'mobile-landscape': { 'raw': '(max-width: 767px) and (orientation: landscape)' },
      },
      fontFamily: {
        // Legacy (conservées tant que la migration typo n'est pas faite).
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        exo2: ['Exo 2', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],

        // Stitch "Digital Atelier" : Manrope pour titres/UI, Newsreader pour corps éditorial.
        headline: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Newsreader', 'Georgia', 'serif'],
        label: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Additifs : ne remplacent pas les radius Tailwind (xl, 2xl, etc.) pour ne rien casser.
        // À utiliser explicitement sur les nouveaux composants de la refonte.
        sheet: "1.5rem", // cartes principales (Stitch "xl")
        tile: "1rem",    // éléments imbriqués (Stitch "lg")
      },
      boxShadow: {
        // Ombres ambient façon lumière naturelle (DESIGN.md §4 : ressenties, pas vues).
        ambient: "0 40px 60px -20px rgba(25, 28, 29, 0.06)",
        "ambient-sm": "0 24px 40px -16px rgba(25, 28, 29, 0.05)",
        // "Jewel" : CTAs primaires, légère empreinte tactile 4px.
        jewel: "0 4px 0 0 #1b3245",
      },
      backdropBlur: {
        vellum: "20px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
