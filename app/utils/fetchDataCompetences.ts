import qs from "qs";

export async function fetchDataCompetences(collection: string, slug: string) {
  // 🔹 Construire la requête API avec le bon filtre et populate
  const query = qs.stringify({
    filters: { slug },
    populate: "picture", // ⚡ Ajoute d'autres champs si besoin
  });

  try {
    const response = await fetch(`http://localhost:1337/api/$(collection)?${query}`, {
      cache: "no-store", // 🔹 Désactive le cache pour éviter les erreurs
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch competences data: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("❌ Error fetching competences data:", error);
    return null;
  }
}
