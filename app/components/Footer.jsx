"use client"

import { useState } from "react"; // Importation du hook useState pour gérer l'état

export default function Footer() {
  const [count, setCount] = useState(0); // État pour suivre le nombre de clics

  // Fonction pour gérer les clics sur le bouton
  function handleClick() {
    setCount(count + 1); // Incrémente le compteur de clics
  }

  return (
    <footer className="bg-white/50 backdrop-blur rounded-lg">
      <div className="max-w-4xl mx-auto flex flex-col items-center py-6 text-sm text-gray-400">
        {/* Affichage de l'année actuelle */}
        <p>&copy; {new Date().getFullYear()} Our Company.</p>
        {/* Affichage du compteur de clics et du bouton */}
        <p>
          Vous avez cliqué {count} fois sur le bouton.
          <button onClick={handleClick}>Click Me</button>
        </p>
      </div>
    </footer>
  );
}