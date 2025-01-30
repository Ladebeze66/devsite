import qs from "qs";


export async function fetchDataCompetences(collection: string, slug: string) {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: "picture",
  });

  console.log(`🛠️ Requête API : http://localhost:1337/api/${collection}?${query}`);

  try {
    const response = await fetch(`http://localhost:1337/api/${collection}?${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch competences data: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Données reçues :", data);
    
    return data.data[0] || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des compétences :", error);
    return null;
  }
}
