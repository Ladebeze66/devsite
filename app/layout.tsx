"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  const [visitCount, setVisitCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Référence pour le menu burger

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Récupère le compteur de visites depuis localStorage
    const visits = localStorage.getItem("visitCount");
    const newVisitCount = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("visitCount", newVisitCount.toString());
    setVisitCount(newVisitCount);
  }, []);

  return (
    <html lang="fr">
      <body>
        <div className="relative min-h-[100dvh] w-full grid grid-rows-[auto_1fr_auto]">
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
          <header className="relative h-16 md:h-16 z-20 bg-white/50 backdrop-blur-md border-b-2 border-gray-500 px-4 py-2 md:px-6 fixed top-0 left-0 w-full shadow-md">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-orbitron-24-bold-italic">
                Portfolio Gras-Calvet Fernand
              </h2>

              {/* Bouton menu burger */}
              <button className="md:hidden p-2 bg-gray-300 rounded" onClick={toggleMenu}>
                ☰
              </button>

              {/* Menu desktop */}
              <nav className="hidden md:flex">
                <ul className="flex gap-x-4 text-black-500 font-orbitron-16-bold">
                  <li><NavLink text="Accueil" path="/" /></li>
                  <li><NavLink text="Portfolio" path="/portfolio" /></li>
                  <li><NavLink text="Compétences" path="/competences" /></li>
                  <li><NavLink text="Contact" path="/contact" /></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div ref={menuRef} className="fixed inset-0 bg-black/50 z-40 flex items-start justify-end p-4">
              <nav className="w-[60%] max-w-sm h-auto min-h-[50vh] max-h-[50vh] bg-gray-800/90 backdrop-blur-lg flex flex-col items-center justify-center space-y-4 z-50 md:hidden text-white font-orbitron-24-bold tracking-wide shadow-lg overflow-y-auto rounded-lg p-6">
                {/* Bouton de fermeture */}
                <button className="absolute top-4 right-4 text-2xl text-white" onClick={toggleMenu}>
                  ✖
                </button>

                {/* Liens du menu */}
                <NavLink text="Accueil" path="/" onClick={toggleMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-500" />
                <NavLink text="Portfolio" path="/portfolio" onClick={toggleMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-500" />
                <NavLink text="Compétences" path="/competences" onClick={toggleMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-500" />
                <NavLink text="Contact" path="/contact" onClick={toggleMenu} className="text-lg text-white hover:text-gray-900 px-4 py-2 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-500" />
              </nav>
            </div>
          )}

          <main className="relative z-10">
            {children}
          </main>

          <Footer />

          <div className="absolute bottom-0 right-0 p-4 text-sm text-gray-500">
            NV : {visitCount}
          </div>
        </div>
      </body>
    </html>
  );
}
