"""API FastAPI de GrasBot — orchestre le retrieval et Ollama.

Historique :
- 2026-04-01 : version initiale minimaliste (GET /ask → Ollama `mistral` sans contexte).
- 2026-04-22 (matin) : refonte RAG (ChromaDB + nomic-embed-text + Qwen3:8b).
- 2026-04-22 (soir) : bascule vers un pipeline **graph + BM25** sans embeddings.
    * Vault `vault-grasbot/` lu directement (frontmatter YAML + wikilinks).
    * Retrieval déterministe (alias / answers / domains / tags / BM25).
    * Expansion par graphe (linked / related / wikilinks du body).
    * Plus de dépendance ChromaDB ni hnswlib ni nomic-embed-text.
    * Module `rag.py` / `index_vault.py` supprimés.
- 2026-04-23 : intégration **Langfuse** pour observabilité complète du pipeline.
    * `/ask` accepte `session_id` et `user_id` optionnels (passés par le front
      depuis ChatBot.js via localStorage/sessionStorage).
    * L'instrumentation vit dans `search.py` (retrieval + build_prompt + generate).
    * Voir `docs-site-interne/langfuse-observability.md` pour le détail.

Voir `docs-site-interne/08-vault-obsidian-retrieval.md` pour l'architecture.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException

# observability doit être importé AVANT search pour que load_dotenv() pose les
# variables d'environnement que search.py lit (OLLAMA_URL, LLM_MODEL, etc.)
# au moment de son import.
from observability import flush as langfuse_flush
from observability import is_enabled as langfuse_enabled
from observability import langfuse

from search import (
    LLM_MODEL,
    MIN_SCORE,
    OLLAMA_URL,
    TOP_K,
    VAULT_DIR,
    answer,
    load_vault,
    reload_vault,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Flush des traces Langfuse au shutdown pour ne rien perdre en buffer."""
    yield
    langfuse_flush()


app = FastAPI(title="GrasBot LLM API", version="3.1.0", lifespan=lifespan)


@app.get("/ask")
async def ask_question(
    q: str,
    session_id: Optional[str] = None,
    user_id: Optional[str] = None,
):
    """Endpoint historique consommé par `app/utils/askAI.js`.

    Le front lit `data.response` : on conserve cette clé pour la compatibilité.
    Les champs `sources` / `grounded` / `model` sont des ajouts non destructifs
    utilisés par `ChatBot.js` pour afficher les sources cliquables.

    `session_id` et `user_id` sont optionnels et transmis pour Langfuse :
    - `session_id` : UUID sessionStorage côté front (même conversation = mêmes questions regroupées).
    - `user_id` : UUID localStorage côté front (anonyme, stable par device).
    Ils sont propagés au span root par `search.answer()` via `langfuse.update_current_trace`.
    """
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Paramètre `q` manquant ou vide.")

    try:
        return answer(q, session_id=session_id, user_id=user_id)
    except Exception as exc:
        print(f"❌  /ask failed ({exc})")
        raise HTTPException(status_code=502, detail=str(exc))


@app.get("/health")
async def health():
    """Configuration active + stats du vault — utile pour debug / monitoring."""
    vault = load_vault()
    by_type: dict[str, int] = {}
    for n in vault.values():
        by_type[n.type] = by_type.get(n.type, 0) + 1

    return {
        "status": "ok",
        "ollama_url": OLLAMA_URL,
        "llm_model": LLM_MODEL,
        "vault": {
            "path": VAULT_DIR.as_posix(),
            "notes_total": len(vault),
            "notes_by_type": by_type,
        },
        "search": {
            "top_k": TOP_K,
            "min_score": MIN_SCORE,
        },
        "observability": {
            "langfuse_enabled": langfuse_enabled(),
        },
    }


@app.post("/reload-vault")
async def reload_vault_endpoint():
    """Force la relecture du vault sans redémarrer l'API (utile après édition)."""
    vault = reload_vault()
    return {"status": "ok", "notes_total": len(vault)}
