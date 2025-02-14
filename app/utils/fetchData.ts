import qs from "qs";
import { getApiUrl } from "./getApiUrl";

export async function fetchData(collection: string, slug: string) {
  const apiUrl = getApiUrl();

  const query = qs.stringify({
    filters: { slug },
    populate: "picture",
  });

  try {
    const fullUrl = `${apiUrl}/api/${collection}?${query}`;

    const response = await fetch(fullUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} : ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des données (${collection}):`, error);
    return null;
  }
}
