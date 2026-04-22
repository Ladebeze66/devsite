import { Manrope, Newsreader } from "next/font/google";

/**
 * Fonts du système "Digital Atelier" (voir docs-site-interne/REFONTE-VISUELLE.md).
 *
 * Chargées via `next/font/google` : Next télécharge les fichiers woff2 au build
 * et les sert depuis le domaine du site (plus de dépendance fonts.googleapis.com,
 * plus de problème de CDN ou de cache navigateur agressif).
 *
 * L'ancien chargement via `@import url(...)` dans `app/globals.css` était strippé
 * par la chaîne PostCSS + Tailwind en production, les polices n'arrivaient jamais
 * au navigateur (diagnostic 2026-04-22 : aucune requête `fonts.googleapis.com`
 * visible dans l'onglet Network).
 *
 * Usage :
 *  1. Importer `manrope` / `newsreader` dans le layout racine.
 *  2. Poser leurs `variable` sur le `<html>` pour exposer `--font-manrope` /
 *     `--font-newsreader` à tout le sous-arbre.
 *  3. `tailwind.config.ts` mappe `font-headline` / `font-body` vers ces variables.
 */

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
