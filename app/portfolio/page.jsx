"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../utils/getApiUrl";
import Carousel from "../components/Carousel";
import "../assets/main.css";
import "../globals.css";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${apiUrl}/api/projects?populate=picture&sort=order:asc`); // Récupération triée depuis Strapi
        if (!response.ok) {
          throw new Error(`Erreur de récupération des projets : ${response.statusText}`);
        }
        const data = await response.json();
        
        // Tri des projets côté Next.js (au cas où Strapi ne le fait pas)
        const sortedProjects = (data.data ?? []).sort((a, b) => (a.order || 999) - (b.order || 999));
  
        setProjects(sortedProjects);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des projets :", error);
      }
    }
  
    fetchProjects();
  }, [apiUrl]);
  

  return (
    <main className="w-full p-3 mt-5 mb-5">
  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7 max-w-7xl mx-auto mobile-landscape">
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
          <Link href={`/portfolio/${project.slug}`}>
            <div className="overflow-hidden w-full h-48 mb-4">
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
