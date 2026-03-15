"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./assets/main.css";
import { getApiUrl } from "./utils/getApiUrl";

async function getHomepageData() {
  const apiUrl = getApiUrl();
  
  // Configuration avec timeout et retry
  const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Tentative avec retry
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🔄 [getHomepageData] Tentative ${attempt}/3 - URL: ${apiUrl}/api/homepages?populate=*`);
      
      const response = await fetchWithTimeout(`${apiUrl}/api/homepages?populate=*`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ [getHomepageData] Données récupérées avec succès");
      return data.data?.[0] ?? null;
      
    } catch (error) {
      console.error(`❌ [getHomepageData] Erreur tentative ${attempt}:`, error);
      
      if (attempt === 3) {
        // Dernière tentative échouée
        console.error("🚨 [getHomepageData] Toutes les tentatives ont échoué");
        return null;
      }
      
      // Attendre avant la prochaine tentative
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return null;
}

export default function HomePage() {
  const [homepage, setHomepage] = useState<any>(null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    getHomepageData().then((data) => setHomepage(data));
  }, []);

  if (!homepage) return <p className="text-center text-blue-500">Chargement de la page...</p>;

  const title = homepage.title ?? "Titre par défaut";
  const cv = homepage.cv ?? "";
  const imageUrl = homepage.photo?.url ? `${apiUrl}${homepage.photo.url}` : null;

  return (
    <main className="w-full mx-auto flex flex-col items-center justify-center p-6 bg-white/55 rounded-lg mt-12 mb-3 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <h1 className="text-3xl font-orbitron-24-bold-italic text-gray-800 mb-4">{title}</h1>

      {imageUrl ? (
        <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-3">
          <img src={imageUrl} alt="Photo de profil" className="w-full h-full object-cover object-center" />
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-gray-500 text-gray-200 rounded-full shadow-md">
          Image indisponible
        </div>
      )}

      <div className="mt-6 text-lg text-black-700 max-w-2xl font-orbitron-16-bold px-6 text-center">
        <ReactMarkdown>{cv}</ReactMarkdown>
      </div>
    </main>
  );
}