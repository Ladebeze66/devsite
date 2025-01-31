"use client";

import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import "./assets/main.css";
import NavLink from "./components/NavLink";

export default function RootLayout({ children }) {
  // États pour gérer la largeur et la hauteur du conteneur principal
  const [numElements, setNumElements] = useState(0);
  const [containerWidth, setContainerWidth] = useState("max-w-4xl");
  const [containerHeight, setContainerHeight] = useState("min-h-[50vh]");

  useEffect(() => {
    // Compter le nombre d'éléments enfants
    const elementsCount = React.Children.count(children);
    setNumElements(elementsCount);

    // Ajuster la largeur et la hauteur en fonction du nombre d'éléments
    if (elementsCount > 5) {
      setContainerWidth("max-w-6xl");
      setContainerHeight("min-h-[80vh]");
    } else if (elementsCount > 3) {
      setContainerWidth("max-w-5xl");
      setContainerHeight("min-h-[70vh]");
    } else {
      setContainerWidth("max-w-4xl");
      setContainerHeight("min-h-[60vh]");
    }
  }, [children]);

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
                  <li>
                    <NavLink text="Accueil" path="/" />
                  </li>
                  <li>
                    <NavLink text="Portfolio" path="/portfolio" />
                  </li>
                  <li>
                    <NavLink text="Compétences" path="/competences" />
                  </li>
                  <li>
                    <NavLink text="Contact" path="/contact" />
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          {/* Conteneur principal pour le contenu */}
          <main className={`backdrop-blur z-10 ${containerWidth} ${containerHeight} mx-auto bg-white/20 rounded-xl py-7 px-8 m-6 overflow-hidden`}>
            {children}
          </main>
          {/* Pied de page */}
          <Footer />
        </div>
      </body>
    </html>
  );
}