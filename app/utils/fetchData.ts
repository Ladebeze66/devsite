import qs from "qs"; // Importation de qs pour construire des requêtes de chaîne de requête

// Fonction pour récupérer des données spécifiques depuis l'API Strapi
export async function fetchData(collection: string, slug: string) {
  // Construction de la requête avec des filtres et des relations à peupler
  const query = qs.stringify({
    filters: { slug }, // Filtre basé sur le slug
    populate: "picture", // On garde les images associées
  });

  try {
    // Envoi de la requête à l'API Strapi
    const response = await fetch(`http://localhost:1337/api/${collection}?${query}`, {
      cache: "no-store", // Désactivation du cache pour obtenir les données les plus récentes
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Récupération des données de la réponse
    const data = await response.json();
    return data.data[0] || null; // Retourne la première entrée ou null si aucune donnée n'est trouvée
  } catch (error) {
    // Gestion des erreurs et log des erreurs
    console.error(`Error fetching ${collection} data:`, error);
    return null;
  }
}