"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const visits = localStorage.getItem("visitCount");
    const newVisitCount = visits ? parseInt(visits, 10) + 1 : 1;
    localStorage.setItem("visitCount", newVisitCount.toString());
    setVisitCount(newVisitCount);
  }, []);

  return (
    <footer className="min-h-[80px] w-full min-w-0 rounded-lg bg-white/50 backdrop-blur">
      <div className="mx-auto flex max-w-4xl min-w-0 flex-col items-center gap-1 px-4 py-6 font-headline text-sm text-gray-700">
        <p>&copy; {new Date().getFullYear()} Gras-Calvet Fernand</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-outline">
          Visite n° {visitCount}
        </p>
      </div>
    </footer>
  );
}
