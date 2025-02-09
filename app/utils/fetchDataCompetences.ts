import qs from "qs";
import { getApiUrl } from "./getApiUrl";

export async function fetchDataCompetences(collection: string, slug: string) {
  const apiUrl = getApiUrl();
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: "picture",
  });

  const fullUrl = `${apiUrl}/api/${collection}?${query}`;
  console.log("🔍 [fetchDataCompetences] Requête API :", fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: "no-store" });

    console.log(`📡 [fetchDataCompetences] Réponse HTTP : ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`❌ [fetchDataCompetences] Erreur HTTP ${response.status} : ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log("✅ [fetchDataCompetences] Données reçues :", JSON.stringify(data, null, 2));
    return data.data?.[0] ?? null;
  } catch (error) {
    console.error("❌ [fetchDataCompetences] Erreur lors de la récupération des compétences :", error);
    return null;
  }
}

export async function fetchDataGlossaire() {
  const apiUrl = getApiUrl();
  const fullUrl = `${apiUrl}/api/glossaires?populate=images`;

  console.log("🔍 [fetchDataGlossaire] Requête API :", fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: "no-store" });

    console.log(`📡 [fetchDataGlossaire] Réponse HTTP : ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`❌ [fetchDataGlossaire] Erreur HTTP ${response.status} : ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log("✅ [fetchDataGlossaire] Données reçues :", JSON.stringify(data, null, 2));
    return data.data ?? [];
  } catch (error) {
    console.error("❌ [fetchDataGlossaire] Erreur lors de la récupération du glossaire :", error);
    return [];
  }
}
