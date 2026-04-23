/**
 * IDs anonymes pour l'instrumentation Langfuse du chatbot GrasBot.
 *
 * Modèle (voir docs-site-interne/langfuse-observability.md §Session / User) :
 *
 *   - `user_id` : UUID v4 persistant dans localStorage (`grasbot_user_id`).
 *     Identifie un même "device" au fil du temps. Pas de PII, pas d'auth.
 *     Permet d'estimer les utilisateurs uniques et de regrouper l'historique
 *     des conversations d'un visiteur récurrent.
 *
 *   - `session_id` : UUID v4 dans sessionStorage (`grasbot_session_id`).
 *     Expire à la fermeture de l'onglet. Regroupe dans Langfuse toutes les
 *     questions d'une même "conversation" pour voir le flow complet.
 *
 * On utilise `crypto.randomUUID()` (disponible partout depuis 2021, couvert
 * par tous les navigateurs modernes). Fallback en cas d'environnement exotique
 * (SSR, navigateur très ancien) : UUID généré par `Math.random` — c'est pour
 * l'observabilité, on ne dépend pas de la cryptographie forte.
 */

function safeRandomUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC 4122 v4 : suffisant pour de l'observabilité (pas de sécurité).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readOrCreate(storage, key) {
  if (typeof window === "undefined") return null;
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const fresh = safeRandomUUID();
    storage.setItem(key, fresh);
    return fresh;
  } catch {
    // localStorage/sessionStorage peut être bloqué (mode privé strict). On
    // renvoie un ID éphémère pour que l'appel marche, sans persister.
    return safeRandomUUID();
  }
}

export function getGrasbotUserId() {
  if (typeof window === "undefined") return null;
  return readOrCreate(window.localStorage, "grasbot_user_id");
}

export function getGrasbotSessionId() {
  if (typeof window === "undefined") return null;
  return readOrCreate(window.sessionStorage, "grasbot_session_id");
}
