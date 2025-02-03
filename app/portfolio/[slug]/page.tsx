"use client";

import { useParams } from "next/navigation";
import ContentSection from "../../components/ContentSection";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ Ajout du typage string | null
  const slug = typeof params.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (!params?.slug) return;

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:1337/api/projects?filters[slug][$eq]=${params.slug}&populate=*`);
        const jsonData = await response.json();

        if (!jsonData?.data || jsonData.data.length === 0) {
          setError("❌ Erreur : Projet introuvable.");
        } else {
          setData(jsonData.data);
        }
      } catch (err) {
        setError("❌ Erreur de chargement des données.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  if (!params?.slug) {
    return <div className="text-red-500 text-center">❌ Erreur : Slug introuvable.</div>;
  }

  if (loading) {
    return <div className="text-blue-500 text-center">⏳ Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return params.slug ? <ContentSection collection="projects" slug={slug} /> : <div className="text-red-500 text-center">❌ Erreur : Slug introuvable.</div>;

}
