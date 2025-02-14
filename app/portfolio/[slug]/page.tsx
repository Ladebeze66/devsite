"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentSection from "../../components/ContentSection";

export default function Page() {
  const params = useParams();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      setSlug(params.slug as string);
    }
  }, [params]);

  if (!slug) {
    return <div className="text-center text-gray-500">⏳ Chargement...</div>;
  }

  return <ContentSection collection="projects" slug={slug} />;
}
