"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState("w-full"); // ✅ Par défaut pleine largeur
  const [containerHeight, setContainerHeight] = useState("min-h-[50vh]");

  useEffect(() => {
    if (!containerRef.current) return;

    const childCount = containerRef.current.children.length; // 📌 Compte le nombre d'enfants

    // 📌 Ajuster la largeur UNIQUEMENT si peu d'éléments
    if (childCount <= 2) {
      setContainerWidth("max-w-3xl"); // ✅ Rétrécir pour la home ou peu de contenu
    } else {
      setContainerWidth("w-full"); // ✅ Sinon pleine largeur
    }

    // 📌 Ajuster la hauteur dynamiquement
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const contentHeight = entry.contentRect.height;

        if (contentHeight > 800) {
          setContainerHeight("min-h-[90vh]");
        } else if (contentHeight > 600) {
          setContainerHeight("min-h-[80vh]");
        } else if (contentHeight > 400) {
          setContainerHeight("min-h-[70vh]");
        } else {
          setContainerHeight("min-h-[50vh]");
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [children]);

  return (
    <html lang="fr">
      <body>
        <div className="bg-wallpaper min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
          <header className="z-10 bg-white/50 backdrop-blur rounded-lg border-2 border-gray-500">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <h2 className="text-2xl font-bold">Portfolio Gras-Calvet Fernand</h2>
              <nav>
                <ul className="flex gap-x-7 text-black-500 font-bold">
                  <li><NavLink text="Accueil" path="/" /></li>
                  <li><NavLink text="Portfolio" path="/portfolio" /></li>
                  <li><NavLink text="Compétences" path="/competences" /></li>
                  <li><NavLink text="Contact" path="/contact" /></li>
                </ul>
              </nav>
            </div>
          </header>

          <div className="overflow-x-auto">
            <main ref={containerRef} className={`backdrop-blur z-10 ${containerWidth} ${containerHeight} mx-auto bg-white/20 rounded-xl py-7 px-8 m-6 transition-all duration-300`}>
              {children}
            </main>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
