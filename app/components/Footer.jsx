"use client";

import { useEffect, useState } from "react";

/**
 * Footer éditorial — étape 8 "Digital Atelier" (voir docs-site-interne/REFONTE-VISUELLE.md §4).
 *
 * Avant : `bg-white/50 rounded-lg` + `text-gray-700`. Alignement partiel avec la refonte
 * (tracking `visite n°`, font-headline) mais surface et radius hors charte.
 *
 * Après : carte vellum légère (`bg-surface-container-lowest/70`, `rounded-tile`,
 * `backdrop-blur-vellum`) sans ombre ambient — le footer ne doit pas flotter autant
 * que les cartes de contenu. Trois lignes éditoriales :
 *   1. Signature Manrope `text-primary` (identité)
 *   2. Pitch Newsreader italic `text-on-surface-variant` (ton éditorial)
 *   3. Compteur de visites `text-outline` (méta discrète)
 */
export default function Footer() {
  const [visitCount, setVisitCount] = useState(0);
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const visits = localStorage.getItem("visitCount");
    const newVisitCount = visits ? parseInt(visits, 10) + 1 : 1;
    localStorage.setItem("visitCount", newVisitCount.toString());
    setVisitCount(newVisitCount);
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-6 sm:px-6">
      <div className="rounded-tile bg-surface-container-lowest/70 px-6 py-5 text-center backdrop-blur-vellum">
        <p className="font-headline text-sm font-bold tracking-tight text-primary">
          Fernand Gras-Calvet
        </p>
        <p className="mt-1 font-body text-xs italic leading-relaxed text-on-surface-variant">
          Portfolio — Étudiant 42 Perpignan · © {year}
        </p>
        <p className="mt-3 font-headline text-[10px] uppercase tracking-[0.3em] text-outline">
          Visite n° {visitCount}
        </p>
      </div>
    </footer>
  );
}
