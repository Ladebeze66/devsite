"use client";

import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  const [visitCount, setVisitCount] = useState(0);

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
        <div className="relative bg-wallpaper min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
          {/* Cercles animés */}
          <div className="absolute z-0 inset-0 overflow-hidden">
            <div className="circle-one blur-3xl w-64 h-64 rounded-full bg-rose-400/60 top-0 right-28 absolute"></div>
            <div className="circle-two blur-3xl w-64 h-64 rounded-full bg-indigo-400/60 bottom-0 left-28 absolute"></div>
          </div>

          <header className="z-10 bg-white/50 backdrop-blur rounded-lg border-2 border-gray-500">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <h2 className="text-2xl font-orbitron-24-bold-italic">Portfolio Gras-Calvet Fernand</h2>
              <nav>
                <ul className="flex gap-x-7 text-black-500 font-orbitron-16-bold">
                  <li><NavLink text="Accueil" path="/" /></li>
                  <li><NavLink text="Portfolio" path="/portfolio" /></li>
                  <li><NavLink text="Compétences" path="/competences" /></li>
                  <li><NavLink text="Contact" path="/contact" /></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Ne pas forcer de largeur ici, chaque page gère son `main` */}
          <main className="relative z-10">
            {children}
          </main>

          <Footer />

          {/* Affichage du compteur de visites */}
          <div className="absolute bottom-0 right-0 p-4 text-sm text-gray-500">
            NV : {visitCount}
          </div>
        </div>
      </body>
    </html>
  );
}