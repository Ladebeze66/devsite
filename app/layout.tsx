"use client";

import React, { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import "./globals.css";
import NavLink from "./components/NavLink";
import { manrope, newsreader } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const AUTO_CLOSE_MS = 4000;

  const clearAutoClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleAutoClose = () => {
    clearAutoClose();
    closeTimerRef.current = setTimeout(() => setIsMenuOpen(false), AUTO_CLOSE_MS);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  useEffect(() => {
    if (!isMenuOpen) {
      clearAutoClose();
      return;
    }

    scheduleAutoClose();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);

    return () => {
      clearAutoClose();
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen && burgerRef.current) {
      burgerRef.current.focus({ preventScroll: true });
    }
  }, [isMenuOpen]);

  // Classes communes pour les liens du drawer mobile : fond container primaire,
  // radius "tile", hover qui inverse vers fond clair + texte primaire (palette Stitch).
  const drawerLinkClass =
    "block px-4 py-2 rounded-tile bg-primary-container/60 text-white transition-colors duration-200 hover:bg-primary-fixed hover:text-primary";
  const drawerLinkActive = "bg-primary-fixed text-primary";

  // NavLink desktop : état actif souligné, inactif discret (palette Stitch).
  const desktopLinkActive = "text-primary border-b-2 border-primary-fixed pb-0.5";
  const desktopLinkInactive =
    "text-on-surface-variant hover:text-primary transition-colors";

  return (
    <html lang="fr" className={`${manrope.variable} ${newsreader.variable}`}>
      <head>
        {/* Material Symbols : chargés via <link> plutôt que via @import CSS qui est
            strippé par la chaîne PostCSS + Tailwind de Next 15 (diagnostic 2026-04-22).
            Ressource critique côté UI → preload pour éviter un flash de texte brut
            sur les icônes des CTAs, du burger et des cartes de la home. */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-w-0 overflow-x-hidden antialiased">
        {/* Wallpaper plein écran (fondation).
            `fixed inset-0` plutôt qu'`absolute` dans le grid : le wallpaper est
            désormais calé sur le viewport, pas sur la hauteur totale de la page.
            Sans ça, sur les pages longues (portfolio, compétences, fiches) le
            conteneur grid atteignait 2-3 viewports de haut et `background-size: cover`
            zoomait l'image pour couvrir cette hauteur — d'où le rendu incohérent
            entre home (courte) et listes (longues). Corrigé le 2026-04-22. */}
        <div className="fixed inset-0 z-0 bg-wallpaper pointer-events-none" aria-hidden="true"></div>

        <div className="relative grid min-h-[100dvh] w-full min-w-0 grid-rows-[auto_1fr_auto]">
          {/* Cercles animés : repalette en ton indigo-ardoise (Stitch "Digital Atelier"). */}
          <div className="absolute z-0 inset-0 overflow-hidden pointer-events-none">
            <div className="circle-one blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-primary/40 top-0 right-10 md:right-28 absolute"></div>
            <div className="circle-two blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-primary-container/30 bottom-0 left-10 md:left-28 absolute"></div>
          </div>

          {/* Header "No-Line" : pas de bordure pleine, juste un shift tonal + ombre ambient diffuse. */}
          <header className="fixed left-0 top-0 z-20 h-16 w-full min-w-0 bg-surface/80 px-4 py-2 shadow-ambient-sm backdrop-blur-vellum md:h-16 md:px-6">
            <div className="mx-auto flex max-w-4xl min-w-0 items-center justify-between gap-2">
              <h2
                className="min-w-0 truncate pr-1 text-xl font-headline font-extrabold italic tracking-tight text-primary md:text-2xl"
                translate="no"
              >
                Portfolio Gras-Calvet Fernand
              </h2>

              {/* Burger ghost (Material Symbols) : plus sobre, couleur primaire, hover tonal. */}
              <button
                ref={burgerRef}
                type="button"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-drawer"
              >
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  translate="no"
                >
                  {isMenuOpen ? "close" : "menu"}
                </span>
              </button>

              {/* Menu desktop : NavLink avec états actif/inactif éditoriaux. */}
              <nav className="hidden md:flex">
                <ul className="flex gap-x-6 font-headline text-sm font-bold uppercase tracking-widest">
                  <li>
                    <NavLink
                      text="Accueil"
                      path="/"
                      activeClassName={desktopLinkActive}
                      inactiveClassName={desktopLinkInactive}
                    />
                  </li>
                  <li>
                    <NavLink
                      text="Portfolio"
                      path="/portfolio"
                      activeClassName={desktopLinkActive}
                      inactiveClassName={desktopLinkInactive}
                    />
                  </li>
                  <li>
                    <NavLink
                      text="Compétences"
                      path="/competences"
                      activeClassName={desktopLinkActive}
                      inactiveClassName={desktopLinkInactive}
                    />
                  </li>
                  <li>
                    <NavLink
                      text="Contact"
                      path="/contact"
                      activeClassName={desktopLinkActive}
                      inactiveClassName={desktopLinkInactive}
                    />
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Drawer mobile (tiroir gauche, 70 %, fond primaire translucide). */}
          <div
            className={`mobile-drawer-root fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-out ${
              isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isMenuOpen}
          >
            <div
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <nav
              id="mobile-drawer"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              className={`mobile-drawer-panel relative z-10 h-full w-[70%] max-w-sm bg-primary/90 backdrop-blur-vellum shadow-ambient flex flex-col gap-3 px-6 pt-20 pb-8 font-headline text-lg font-bold tracking-tight transition-transform duration-300 ease-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={scheduleAutoClose}
              onTouchStart={scheduleAutoClose}
              onTouchMove={scheduleAutoClose}
            >
              <NavLink
                text="Accueil"
                path="/"
                onClick={closeMenu}
                className={drawerLinkClass}
                activeClassName={drawerLinkActive}
              />
              <NavLink
                text="Portfolio"
                path="/portfolio"
                onClick={closeMenu}
                className={drawerLinkClass}
                activeClassName={drawerLinkActive}
              />
              <NavLink
                text="Compétences"
                path="/competences"
                onClick={closeMenu}
                className={drawerLinkClass}
                activeClassName={drawerLinkActive}
              />
              <NavLink
                text="Contact"
                path="/contact"
                onClick={closeMenu}
                className={drawerLinkClass}
                activeClassName={drawerLinkActive}
              />
            </nav>
          </div>

          <main className="relative z-10 w-full min-w-0 max-w-full min-h-0 pt-20 md:pt-24">
            {children}
          </main>

          <div className="relative z-10 w-full min-w-0 shrink-0">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
