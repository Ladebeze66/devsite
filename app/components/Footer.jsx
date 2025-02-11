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
      <div className="max-w-4xl mx-auto flex flex-col items-center font-orbitron-12 py-6 text-sm text-gray-700">
        {/* Affichage de l'année actuelle */}
        <p>&copy; {new Date().getFullYear()} Gras-Calvet Fernand</p>
      </div>
    </footer>
  );
}