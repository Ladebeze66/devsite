"use client"

import { useState } from "react";

export default function Footer() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <footer className="min-h-[80px] w-full min-w-0 rounded-lg bg-white/50 backdrop-blur">
      <div className="mx-auto flex max-w-4xl min-w-0 flex-col items-center px-4 py-6 font-orbitron-12 text-sm text-gray-700">
        <p>&copy; {new Date().getFullYear()} Gras-Calvet Fernand</p>
      </div>
    </footer>
  );
}