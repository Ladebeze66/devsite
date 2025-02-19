"use client";

import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  const [visitCount, setVisitCount] = useState(0);

const [isMenuOpen, setIsMenuOpen] = useState(false);
const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


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
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          
        </div>

          {/* Cercles animés */}
          <div className="absolute z-0 inset-0 overflow-hidden">
          <div className="circle-one blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-rose-400/60 top-0 right-10 md:right-28 absolute"></div>
          <div className="circle-two blur-3xl w-40 md:w-64 h-40 md:h-64 rounded-full bg-indigo-400/60 bottom-0 left-10 md:left-28 absolute"></div>
          </div>
          <header className="z-10 bg-white/50 backdrop-blur rounded-lg border-2 font-orbitron-16-bold border-gray-500 px-4 py-2 md:px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-orbitron-24-bold-italic">Portfolio Gras-Calvet Fernand</h2>
    
          {/* Bouton menu burger */}
          <button className="md:hidden p-2 bg-gray-300 rounded" onClick={toggleMenu}>
            ☰
          </button>

          {/* Menu mobile */}
          {isMenuOpen && (
            <nav className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center space-y-10 z-50 md:hidden text-white font-orbitron-24-bold tracking-wide shadow-lg border-l border-gray-600">

              {/* Bouton de fermeture */}
              <button className="absolute top-6 right-6 text-3xl text-white" onClick={toggleMenu}>
                ✖
              </button>

              {/* Liens du menu */}
              <NavLink text="Accueil"
              path="/"
              onClick={toggleMenu}
              className="text-2xl text-white hover:text-gray-900 px-6 py-3 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-white" />
              <NavLink text="Portfolio"
              path="/portfolio"
              onClick={toggleMenu}
              className="text-2xl text-white hover:text-gray-900 px-6 py-3 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-white" />
              <NavLink text="Compétences"
              path="/competences"
              onClick={toggleMenu}
              className="text-2xl text-white hover:text-gray-900 px-6 py-3 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-white" />
              <NavLink text="Contact"
              path="/contact"
              onClick={toggleMenu}
              className="text-2xl text-white hover:text-gray-900 px-6 py-3 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-white" />
            </nav>
          )}



    {/* Menu desktop */}
    <nav className="hidden md:flex">
      <ul className="flex gap-x-4 text-black-500 font-orbitron-16-b</nav>old">
        <li><NavLink text="Accueil" path="/" /></li>
        <li><NavLink text="Portfolio" path="/portfolio" /></li>
        <li><NavLink text="Compétences" path="/competences" /></li>
        <li><NavLink text="Contact" path="/contact" /></li>
      </ul>
    </nav>
  </div>
</header>



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