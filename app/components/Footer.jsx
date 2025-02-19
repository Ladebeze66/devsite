"use client"

import { useState } from "react";

export default function Footer() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <footer className="bg-white/50 backdrop-blur rounded-lg min-h-[80px]">
      <div className="max-w-4xl mx-auto flex flex-col items-center font-orbitron-12 py-6 text-sm text-gray-700">
        <p>&copy; {new Date().getFullYear()} Gras-Calvet Fernand</p>
      </div>
    </footer>
  );
}