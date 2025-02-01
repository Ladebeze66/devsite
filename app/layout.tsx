"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  // Référence pour observer la taille du conteneur
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState("max-w-4xl");
  const [containerHeight, setContainerHeight] = useState("min-h-[50vh]");

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        
        if (width > 1400) {
          setContainerWidth("max-w-full");
        } else if (width > 1200) {
          setContainerWidth("max-w-6xl");
        } else if (width > 1000) {
          setContainerWidth("max-w-5xl");
        } else {
          setContainerWidth("max-w-4xl");
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <html lang="fr">
      <body>
        {/* Conteneur principal avec image de fond */}
        <div className="bg-wallpaper min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
          {/* Cercles de fond pour l'effet visuel */}
          <div className="absolute z-0 inset-0 overflow-hidden">
            <div className="circle-one blur-3xl w-64 h-64 rounded-full bg-rose-400/60 top-0 right-28 absolute"></div>
            <div className="circle-two blur-3xl w-64 h-64 rounded-full bg-indigo-400/60 bottom-0 left-28 absolute"></div>
          </div>
          
          {/* En-tête avec navigation */}
          <header className="z-10 bg-white/50 backdrop-blur rounded-lg border-2 border-gray-500">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <h2 className="text-2xl font-bold">Portofolio Gras-Calvet Fernand</h2>
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

          {/* Conteneur principal avec ajustement dynamique et scroll horizontal si nécessaire */}
          <div className="overflow-x-auto">
            <main 
              ref={containerRef} 
              className={`backdrop-blur z-10 ${containerWidth} ${containerHeight} mx-auto bg-white/20 rounded-xl py-7 px-8 m-6`}
            >
              {children}
            </main>
          </div>

          {/* Pied de page */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
