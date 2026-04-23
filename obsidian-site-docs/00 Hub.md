# Hub — Site portfolio (dépôt my-next-site)

> Point d’entrée du pack. La doc technique **complète** est **intégrée** (dossier `docs-site-interne/`) : voir [[03 Documentation intégrée (dépôt)]] et [README doc](docs-site-interne/README.md).

**Site** : [fernandgrascalvet.com](https://fernandgrascalvet.com)

## Fiches de ce pack

- [[01 Commandes - Démarrage, arrêt, reload vault]]
- [[02 Ports et URLs]]
- [[03 Documentation intégrée (dépôt)]]
- [[04 GrasBot et API LLM (résumé)]]

## Rappel express

| Action | Où ? |
|--------|------|
| Démarrer les 3 services (Windows) | `start-my-site.ps1` à la racine du dépôt |
| Arrêter | `stop-my-site.ps1` |
| Recharger le vault sans redémarrer l’API | `POST /reload-vault` sur l’instance FastAPI locale |
| Doc opérationnelle (copie dans le coffre) | [CONFIGURATION_SITE.md](CONFIGURATION_SITE.md) |
