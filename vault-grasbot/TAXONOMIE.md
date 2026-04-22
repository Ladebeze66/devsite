# Taxonomie du vault GrasBot

Vocabulaire contrôlé pour les champs `domains`, `tags`, `aliases`, `answers`
du frontmatter YAML. Garantit que le pipeline de retrieval (graph + BM25 de
`llm-api/search.py`) trouve des correspondances cohérentes entre notes.

**Règle d'or** : si tu inventes un nouveau domaine ou tag, **ajoute-le ici
avant** de l'utiliser dans une note. Pour `aliases`, libre à toi d'en
ajouter autant que nécessaire par note.

---

## Domaines (`domains:`)

Liste fermée. Une note doit avoir entre 1 et 4 domaines, du plus spécifique
au plus général.

| Slug | Libellé | Description |
|---|---|---|
| `algorithmique` | Algorithmique | Structures de données, tri, complexité |
| `c` | Langage C | Projets 42 en C (libft, printf, GNL, …) |
| `cpp` | C++ | POO, templates, STL, projets C++ 42 |
| `systeme` | Systèmes | Unix, processus, threads, mutex, IPC |
| `reseau` | Réseaux | TCP/IP, sockets, IRC, routage |
| `web` | Web | Next.js, React, Strapi, APIs |
| `devops` | DevOps | Docker, Nginx, conteneurs, CI/CD |
| `securite` | Sécurité | Hardening, SSH, firewall, cybersécurité |
| `ia` | Intelligence artificielle | LLMs, embeddings, agents, chatbots |
| `graphique` | Graphique | Raycasting, MinilibX, rendu 2D/3D |
| `3d` | Impression 3D | Slicers, firmwares, conception |
| `domotique` | Domotique | Home Assistant, Zigbee, IoT |
| `ecole-42` | École 42 | Tout projet ou tranche de formation 42 |
| `parcours` | Parcours | CV, bio, reconversion, trajectoire |

## Tags (`tags:`)

Plus libres que les domaines, mais garder une cohérence. Liste des tags
actuellement utilisés :

| Tag | Usage |
|---|---|
| `moc` | Note qui est un Map of Content |
| `cv` | Note liée au CV personnel |
| `parcours` | Bio, reconversion, trajectoire |
| `alternance` | Recherche d'alternance / stage |
| `reconversion` | Changement de carrière |
| `data-ia` | Stream data / IA pour alternance |
| `42-commun` | Projets du tronc commun 42 |
| `42-piscine` | Projets de la piscine 42 |
| `42-tronc` | Projets du tronc commun (post-piscine) |
| `tri` | Algorithmes de tri |
| `concurrence` | Threads, mutex, synchronisation |
| `docker` | Conteneurisation |
| `makefile` | Build system GNU Make |

## Aliases (`aliases:`)

Libre par note. **Objectif** : capter toutes les formulations naturelles que
pourrait employer un visiteur pour désigner le sujet de la note.

Règles :

- **Entre 3 et 12 aliases par note** (ni trop peu pour la couverture, ni
  trop pour ne pas bruiter le scoring).
- Formes **courtes** (un à trois mots, en minuscules).
- Inclure : **variantes orthographiques**, **acronymes**, **synonymes FR/EN**,
  **formulations utilisateur** probables.
- Ne **pas** inclure de phrases entières (c'est le rôle d'`answers:`).

**Exemples** :

```yaml
# Note ia.md
aliases:
  - IA
  - intelligence artificielle
  - LLM
  - modèles de langage
  - chatbot
  - Ollama
  - Qwen
  - Mistral
  - machine learning
  - deep learning
  - data science

# Note push-swap.md
aliases:
  - push swap
  - push_swap
  - tri par piles
  - algorithme de tri 42
  - push
  - swap
```

## Answers (`answers:`)

Questions-types **formulées à la 1re personne du visiteur** auxquelles cette
note apporte une réponse directe. Fort signal pour le retrieval.

Règles :

- **2 à 6 answers par note**.
- Rédigées comme un visiteur **naturel** : *« Quelles sont ses compétences
  en IA ? »*, pas *« compétences IA »*.
- Ciblées : une answer doit **vraiment** appeler cette note comme source
  principale (pas une note périphérique).

**Exemples** :

```yaml
# Note cv-grascalvet-fernand.md
answers:
  - "Qui est Fernand Gras-Calvet ?"
  - "Quel est son parcours ?"
  - "Que peux-tu me dire sur Fernand ?"
  - "Quel est son profil ?"
  - "Cherche-t-il une alternance ?"

# Note ia.md
answers:
  - "Quelles sont ses compétences en IA ?"
  - "Utilise-t-il des LLMs locaux ?"
  - "Qu'est-ce qui l'intéresse dans l'IA ?"
```

## Priority (`priority:`)

Entier de 1 à 10. Boost léger appliqué au scoring.

| Valeur | Usage |
|---|---|
| 9–10 | Notes stratégiques (CV, MOCs principaux) |
| 6–8  | Notes riches (compétences, projets emblématiques) |
| 5    | Défaut (la plupart des projets 42) |
| 3–4  | Notes techniques internes (auto-doc) |
| 1–2  | Notes archivées, peu pertinentes pour le visiteur |

## Visibility (`visibility:`)

- `public` (défaut) : accessible au chatbot et indexable
- `private` : **exclue** du retrieval par `load_vault()` (usage personnel)

---

## Quand régénérer ?

- Après ajout d'une note Strapi : `python strapi_extraction/build-vault.py`
- Après édition manuelle dans Obsidian : rien, l'API lit le vault au vol
- Après changement de taxonomie : éditer ce fichier puis les notes concernées
- Après chargement de l'API : `POST /reload-vault` pour recharger sans redémarrer
