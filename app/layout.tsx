
"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import "./globals.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [visitCount, setVisitCount] = useState(0);
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

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  useEffect(() => {
    const visits = localStorage.getItem("visitCount");
    const newVisitCount = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("visitCount", newVisitCount.toString());
    setVisitCount(newVisitCount);
  }, []);

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

  return (
    <html lang="fr">
      <body className="min-w-0 overflow-x-hidden antialiased">
        <div className="relative grid min-h-[100dvh] w-full min-w-0 grid-rows-[auto_1fr_auto]">
          {/* Conserve le fond en plein écran */}
          <div className="absolute inset-0 bg-wallpaper"></div>

          {/* Contenu centré avec largeur contrôlée */}
          <div className="relative z-10 max-w-5xl w-full mx-auto"></div>

          {/* Cercles animés */}
          <div className="absolute z-0 inset-0 overflow-hidden">
            <div className="circle-one blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-rose-400/60 top-0 right-10 md:right-28 absolute"></div>
            <div className="circle-two blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-indigo-400/60 bottom-0 left-10 md:left-28 absolute"></div>
          </div>

          {/* Header */}
          <header className="fixed left-0 top-0 z-20 h-16 w-full min-w-0 border-b-2 border-gray-500 bg-white/50 px-4 py-2 shadow-md backdrop-blur-md md:h-16 md:px-6">
            <div className="mx-auto flex max-w-4xl min-w-0 items-center justify-between gap-2">
              <h2 className="min-w-0 truncate pr-1 text-xl font-headline font-extrabold italic tracking-tight md:text-2xl">
                Portfolio Gras-Calvet Fernand
              </h2>

              {/* Bouton menu burger */}
              <button
                ref={burgerRef}
                type="button"
                className="md:hidden p-2 bg-gray-300 rounded"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-drawer"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>

              {/* Menu desktop */}
              <nav className="hidden md:flex">
                <ul className="flex gap-x-4 text-black-500 font-headline font-bold">
                  <li><NavLink text="Accueil" path="/" /></li>
                  <li><NavLink text="Portfolio" path="/portfolio" /></li>
                  <li><NavLink text="Compétences" path="/competences" /></li>
                  <li><NavLink text="Contact" path="/contact" /></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Drawer mobile (tiroir gauche, 70%, fond sombre translucide) */}
          <div
            className={`mobile-drawer-root fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-out ${
              isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isMenuOpen}
          >
            {/* Voile : tap pour fermer */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Colonne tiroir */}
            <nav
              id="mobile-drawer"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              className={`mobile-drawer-panel relative z-10 h-full w-[70%] max-w-sm bg-gray-900/70 backdrop-blur-md border-r border-white/10 shadow-2xl flex flex-col gap-3 px-6 pt-20 pb-8 text-white font-headline font-extrabold text-2xl tracking-tight transition-transform duration-300 ease-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={scheduleAutoClose}
              onTouchStart={scheduleAutoClose}
              onTouchMove={scheduleAutoClose}
            >
              <NavLink text="Accueil" path="/" onClick={closeMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700/80 rounded-lg transition-all duration-300 hover:bg-gray-500" />
              <NavLink text="Portfolio" path="/portfolio" onClick={closeMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700/80 rounded-lg transition-all duration-300 hover:bg-gray-500" />
              <NavLink text="Compétences" path="/competences" onClick={closeMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700/80 rounded-lg transition-all duration-300 hover:bg-gray-500" />
              <NavLink text="Contact" path="/contact" onClick={closeMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700/80 rounded-lg transition-all duration-300 hover:bg-gray-500" />
            </nav>
          </div>

          <main className="relative z-10 w-full min-w-0 max-w-full min-h-0 pt-20 md:pt-24">
            {children}
          </main>

          <div className="relative z-10 w-full min-w-0 shrink-0">
            <Footer />
          </div>

          <div className="absolute bottom-0 right-0 p-4 text-sm text-gray-500">
            NV : {visitCount}
          </div>
        </div>
      </body>
    </html>
  );
}

