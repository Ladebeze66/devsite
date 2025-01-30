import qs from "qs";

// ✅ Fonction pour récupérer une compétence spécifique
export async function fetchDataCompetences(collection: string, slug: string) {
  const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: "picture", // On garde les images des compétences
  });

  console.log(`🛠️ Requête API Compétence : http://localhost:1337/api/${collection}?${query}`);

  try {
    const response = await fetch(`http://localhost:1337/api/${collection}?${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch competences data: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Données reçues (Compétence) :", data);

    return data.data[0] || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des compétences :", error);
    return null;
  }
}

export async function fetchDataGlossaire() {
  try {
    console.log("🛠️ Requête API Glossaire : http://localhost:1337/api/glossaires?populate=images");

    const response = await fetch("http://localhost:1337/api/glossaires?populate=images", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch glossaire data: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Données reçues (Glossaire) :", data);

    return data.data || [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du glossaire :", error);
    return [];
  }
}

