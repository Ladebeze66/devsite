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

Voir `docs-site-interne/08-vault-obsidian-retrieval.md` pour l'architecture.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException

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

app = FastAPI(title="GrasBot LLM API", version="3.0.0")


@app.get("/ask")
async def ask_question(q: str):
    """Endpoint historique consommé par `app/utils/askAI.js`.

    Le front lit `data.response` : on conserve cette clé pour la compatibilité.
    Les champs `sources` / `grounded` / `model` sont des ajouts non destructifs
    utilisés par `ChatBot.js` pour afficher les sources cliquables.
    """
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Paramètre `q` manquant ou vide.")

    try:
        return answer(q)
    except Exception as exc:
        print(f"❌  /ask failed ({exc})")
        raise HTTPException(status_code=502, detail=str(exc))


@app.get("/health")
async def health():
    """Configuration active + stats du vault — utile pour debug / monitoring."""
    vault = load_vault()
    # Stats rapides pour vérifier que le vault est bien chargé
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
    }


@app.post("/reload-vault")
async def reload_vault_endpoint():
    """Force la relecture du vault sans redémarrer l'API (utile après édition)."""
    vault = reload_vault()
    return {"status": "ok", "notes_total": len(vault)}
