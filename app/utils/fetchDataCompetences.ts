import qs from "qs";
import { getApiUrl } from "./getApiUrl";

export async function fetchDataCompetences(collection: string, slug: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error("❌ [fetchDataCompetences] URL de l'API invalide !");
    return null;
  }

  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: "picture",
  });

  const fullUrl = `${apiUrl}/api/${collection}?${query}`;
  console.log("🔍 [fetchDataCompetences] Requête API :", fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} : ${response.statusText}`);
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
  if (!apiUrl) {
    console.error("❌ [fetchDataGlossaire] URL de l'API invalide !");
    return [];
  }

  const fullUrl = `${apiUrl}/api/glossaires?populate=images`;
  console.log("🔍 [fetchDataGlossaire] Requête API :", fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} : ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [fetchDataGlossaire] Données reçues :", JSON.stringify(data, null, 2));
    return data.data ?? [];
  } catch (error) {
    console.error("❌ [fetchDataGlossaire] Erreur lors de la récupération du glossaire :", error);
    return [];
  }
}
