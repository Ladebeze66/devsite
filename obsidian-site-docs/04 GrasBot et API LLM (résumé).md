# GrasBot et API LLM (résumé)

- **Rôle** : chatbot intégré au site (FAB global) ; questions/réponses s’appuient sur `vault-grasbot/` et un modèle local via **Ollama** (ex. Qwen3), orchestré par **FastAPI** (`llm-api/search.py`).

- **v3 (2026)** : retrieval **graphe + BM25** sur le vault, **sans** embeddings / ChromaDB. Détail : [08-vault-obsidian-retrieval.md](docs-site-interne/08-vault-obsidian-retrieval.md).

- **Observabilité** : **Langfuse** (optionnel, secrets dans `llm-api/.env` du dépôt). Doc : [langfuse-observability.md](docs-site-interne/langfuse-observability.md).

- **Rechargement** du contenu textuel du vault côté API : [[01 Commandes - Démarrage, arrêt, reload vault]] (`POST /reload-vault`).

- **Extraction** Strapi → vault : `strapi_extraction/build-vault.py` (peut écraser les notes `source: strapi` ; ne pas toucher `source: manual`).

## Voir aussi

- [[00 Hub]]
- [[02 Ports et URLs]]
