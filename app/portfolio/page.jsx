"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../utils/getApiUrl";
import Carousel from "../components/Carousel"; // ✅ Import du carrousel

export default function Page() {
  const [projects, setProjects] = useState([]); // ✅ Stocker les projets
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchProjects() {
      console.log("🔍 API utilisée pour les projets :", apiUrl);
      try {
        const response = await fetch(`${apiUrl}/api/projects?populate=picture`);
        if (!response.ok) {
          throw new Error(`Erreur de récupération des projets : ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data.data ?? []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des projets :", error);
      }
    }

    fetchProjects();
  }, [apiUrl]);

  return (
    <main className="w-full p-3 mt-5 mb-5">
      

      {/* Grille des projets */}
      <div className="grid gap-7 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
        {projects.map((project) => {
          const pictures = project.picture ?? [];
          const images = pictures.map((img) => ({
            url: `${apiUrl}${img.url}`,
            alt: img.name || "Project image",
          }));

          return (
            <div
              key={project.id}
              className="bg-white/80 rounded-lg shadow-md overflow-hidden w-80 h-96 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-4"
            >
              {/* Lien vers la page de détail du projet */}
              <Link href={`/portfolio/${project.slug}`}>
                <div className="overflow-hidden w-full h-48 mb-4">
                  {/* ✅ Ajout du carrousel au lieu d'une image unique */}
                  {images.length > 1 ? (
                    <Carousel images={images} className="h-48" />
                  ) : (
                    <img
                      src={images[0]?.url || "/placeholder.jpg"}
                      alt={images[0]?.alt || "Project image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-grow overflow-y-auto max-h-32 hide-scrollbar show-scrollbar">
                  <p className="font-orbitron-16-bold text-xl mb-2">{project.name}</p>
                  <p className="text-gray-700 text-sm font-orbitron-12 hover:text-base transition-all duration-200 ease-in-out">
                    {project.description}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
