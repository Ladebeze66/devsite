import qs from "qs"; // Importation de qs pour construire des requêtes de chaîne de requête
import { getApiUrl } from "./getApiUrl"; // 🔥 Import de l'URL dynamique

// Fonction pour récupérer des données spécifiques depuis l'API Strapi
export async function fetchData(collection: string, slug: string) {
  const apiUrl = getApiUrl(); // 🔥 Détection automatique de l'URL (local ou HTTPS)

  // Construction de la requête avec des filtres et des relations à peupler
  const query = qs.stringify({
    filters: { slug }, // Filtre basé sur le slug
    populate: "picture", // On garde les images associées
  });

  try {
    const fullUrl = `${apiUrl}/api/${collection}?${query}`; // 🔥 URL finale
    console.log(`🔍 Requête API vers : ${fullUrl}`); // Log pour vérifier l'URL

    // Envoi de la requête à l'API Strapi
    const response = await fetch(fullUrl, {
      cache: "no-store", // Désactivation du cache pour obtenir les données les plus récentes
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} : ${response.statusText}`);
    }

    // Récupération des données de la réponse
    const data = await response.json();
    return data.data[0] || null; // Retourne la première entrée ou null si aucune donnée n'est trouvée
  } catch (error) {
    // Gestion des erreurs et log des erreurs
    console.error(`❌ Erreur lors de la récupération des données (${collection}):`, error);
    return null;
  }
}
