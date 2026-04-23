/**
 * Proxy Next.js vers l'API Python GrasBot.
 *
 * Rôle : éviter l'exposition directe du domaine `llmapi.fernandgrascalvet.com`
 * depuis le navigateur (CORS, rate limiting applicatif, logging Next côté server).
 *
 * v3.1 (2026-04-23) — relais des IDs d'observabilité Langfuse :
 * - Les paramètres `session_id` et `user_id` passés par le front (voir
 *   `app/utils/grasbotIds.js`) sont propagés tels quels vers l'API Python
 *   qui les injecte dans la trace Langfuse.
 * - Whitelist stricte des query params relayés (q, session_id, user_id).
 *   Toute autre clé est ignorée → pas de risque de SSRF via query injection.
 */

const UPSTREAM_BASE = "https://llmapi.fernandgrascalvet.com";
const ALLOWED_PARAMS = new Set(["q", "session_id", "user_id"]);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get("q");

  if (!question) {
    return new Response(JSON.stringify({ error: "Question manquante" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Construction des params upstream : whitelist only.
  const upstream = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    if (ALLOWED_PARAMS.has(key) && value) {
      upstream.set(key, value);
    }
  }

  const apiUrl = `${UPSTREAM_BASE}/ask?${upstream.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur de communication avec l'API" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
