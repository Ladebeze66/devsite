import qs from "qs"; // Importation de qs pour construire des requêtes de chaîne de requête

// Fonction pour récupérer une compétence spécifique
export async function fetchDataCompetences(collection: string, slug: string) {
  // Construction de la requête avec des filtres et des relations à peupler
  const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: "picture", // On garde les images des compétences
  });

  // Log de la requête API pour le débogage
  console.log(`🛠️ Requête API Compétence : http://localhost:1337/api/${collection}?${query}`);

  try {
    // Envoi de la requête à l'API Strapi
    const response = await fetch(`http://localhost:1337/api/${collection}?${query}`, {
      cache: "no-store",
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      throw new Error(`Failed to fetch competences data: ${response.status}`);
    }

    // Récupération des données de la réponse
    const data = await response.json();
    console.log("✅ Données reçues (Compétence) :", data);

    // Retourne la première compétence ou null si aucune donnée n'est trouvée
    return data.data[0] || null;
  } catch (error) {
    // Gestion des erreurs et log des erreurs
    console.error("❌ Erreur lors de la récupération des compétences :", error);
    return null;
  }
}

// Fonction pour récupérer les données du glossaire
export async function fetchDataGlossaire() {
  try {
    // Log de la requête API pour le débogage
    console.log("🛠️ Requête API Glossaire : http://localhost:1337/api/glossaires?populate=images");

    // Envoi de la requête à l'API Strapi
    const response = await fetch("http://localhost:1337/api/glossaires?populate=images", {
      cache: "no-store",
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      throw new Error(`Failed to fetch glossaire data: ${response.status}`);
    }

    // Récupération des données de la réponse
    const data = await response.json();
    console.log("✅ Données reçues (Glossaire) :", data);

    // Retourne les données du glossaire ou un tableau vide si aucune donnée n'est trouvée
    return data.data || [];
  } catch (error) {
    // Gestion des erreurs et log des erreurs
    console.error("❌ Erreur lors de la récupération du glossaire :", error);
    return [];
  }
}