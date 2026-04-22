/**
 * Appelle l'API GrasBot via le proxy Next (/api/proxy).
 *
 * Historique :
 * - v1 : retournait juste `data.response` (string). Compatibilité ascendante
 *   assurée côté API (le champ `response` existe toujours).
 * - v3 (2026-04-22) : retourne maintenant l'objet complet pour que `ChatBot.js`
 *   puisse afficher les sources citées, le badge `grounded`, etc. Ajoute un
 *   timeout (45 s) via `AbortController` pour éviter les spinners infinis.
 *
 * @param {string} question
 * @returns {Promise<{
 *   response: string,
 *   sources?: Array<{slug: string, title: string, type: string, score: number, url?: string}>,
 *   grounded?: boolean,
 *   model?: string,
 *   vault_size?: number,
 * }>}
 */
export async function askAI(question) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(`/api/proxy?q=${encodeURIComponent(question)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    // Rétrocompatibilité : même si l'API ne renvoyait que `response`, on
    // retourne l'objet tel quel.
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return {
        response:
          "La réponse a mis trop de temps. Le modèle est peut-être occupé, réessayez dans un instant.",
        sources: [],
        grounded: false,
        _timeout: true,
      };
    }
    throw error;
  }
}
