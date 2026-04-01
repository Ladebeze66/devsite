# API LLM et chatbot (GrasBot)

**Dernière mise à jour :** 2026-04-01

## Chaîne côté navigateur

1. `app/components/ChatBot.js` appelle `askAI(question)` (`app/utils/askAI.js`).
2. `askAI` envoie un **GET** vers **`/api/proxy?q=...`** (route Next.js App Router).
3. `app/api/proxy/route.js` appelle en dur **`https://llmapi.fernandgrascalvet.com/ask?q=...`** et renvoie le corps JSON tel quel.

**Conséquence :** en développement local, le chatbot s'appuie sur l'**API LLM déployée** sur ce domaine, pas sur `uvicorn` local (`http://localhost:8000`) tant que l'URL n'est pas rendue configurable.

## Réponse attendue par le front

- Dans `askAI.js`, le texte affiché est lu via **`data.response`**. Le flux Ollama (`/api/generate`) renvoie en général un champ `response` dans le JSON ; si l'API distante ou le format change, vérifier ce mapping.

## FastAPI local (`llm-api/api.py`)

- Endpoint **GET** `/ask`, paramètre query **`q`**.
- Requête **POST** vers Ollama : `http://localhost:11434/api/generate` avec JSON `model: "mistral"`, `prompt`, `stream: false`.
- Dépendances : voir `CONFIGURATION_SITE.md` (FastAPI, uvicorn, requests).

## Fichiers clés

```
app/utils/askAI.js
app/api/proxy/route.js
app/components/ChatBot.js
llm-api/api.py
```

## Piste d'évolution

- Variable d'environnement (ex. URL LLM côté serveur) pour pointer vers `http://localhost:8000` en dev et vers la prod en déploiement, au lieu d'une URL figée dans `route.js`.
