# CMS Strapi

**Dernière mise à jour :** 2026-04-01

## Emplacement

- Code : `cmsbackend/`
- Schémas : `cmsbackend/src/api/<nom>/content-types/<nom>/schema.json`

Tous les types listés ci-dessous ont **`draftAndPublish: true`** : penser à **publier** les entrées dans l’admin.

## Content-types

### `homepage` (collection `homepages`)

| Champ | Type | Notes |
|-------|------|--------|
| `title` | string | requis |
| `cv` | richtext | requis |
| `photo` | media (single) | requis |

Utilisation front : `app/page.tsx` — premier enregistrement `populate=*`, image : `${apiUrl}${photo.url}`.

### `project` (collection `projects`)

| Champ | Type | Notes |
|-------|------|--------|
| `name` | string | requis |
| `description` | text | requis |
| `picture` | media (multiple) | requis |
| `slug` | uid ← `name` | requis |
| `Resum` | richtext | requis (nom du champ avec majuscule) |
| `link` | string (URL) | requis |
| `order` | integer | optionnel |

### `competence` (collection `competences`)

| Champ | Type | Notes |
|-------|------|--------|
| `name` | string | requis |
| `content` | richtext | requis |
| `picture` | media (multiple) | requis |
| `slug` | uid ← `name` | requis |
| `order` | integer | optionnel |

### `message` (supprimé le 2026-04-23)

Ancien content-type pour stocker les soumissions du formulaire de contact. Supprimé car le formulaire envoie désormais une notification email via **Brevo** (voir `contact-flow.md`) — plus besoin de stockage Strapi. Les 4 fichiers `cmsbackend/src/api/message/**` ont été supprimés ; la table SQLite `messages` reste orpheline (inoffensive, peut être droppée manuellement).

### `glossaire` (collection `glossaires`)

| Champ | Type | Notes |
|-------|------|--------|
| `mot_clef` | string | requis |
| `slug` | uid ← `mot_clef` | requis |
| `variantes` | json | requis |
| `description` | richtext | requis |
| `images` | media (multiple) | requis |

## API REST

- Base : `http://localhost:1337` (dev) ou `https://api.fernandgrascalvet.com` (prod).
- Préfixe : `/api/<pluralName>` (ex. `/api/projects`, `/api/homepages`).

## Fichiers de config Strapi (référence)

```
cmsbackend/config/database.ts
cmsbackend/config/server.ts
cmsbackend/config/middlewares.ts
cmsbackend/config/api.ts
```
