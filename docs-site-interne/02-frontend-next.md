# Frontend Next.js

**Dernière mise à jour :** 2026-05-10

## Stack

- **Next.js** 15.x, **React** 18, **TypeScript** (fichiers `.tsx`/`.ts`) avec fichiers **`.jsx`/`.js`** encore présents.
- **Tailwind CSS** + `@tailwindcss/typography`.
- Rendu riche Strapi : `@strapi/blocks-react-renderer`, **react-markdown** + rehype/remark.

## Routes (App Router)

| Chemin | Fichier | Notes |
|--------|---------|--------|
| `/` | `app/page.tsx` | Accueil : `GET /api/homepages?populate=*` |
| `/portfolio` | `app/portfolio/page.jsx` | Liste projets |
| `/portfolio/[slug]` | `app/portfolio/[slug]/page.tsx` | Détail projet : `ContentSection` + `fetchData('projects', slug)` |
| `/competences` | `app/competences/page.jsx` | Liste compétences — tri par champ Strapi `order` (v4 : `attributes.order`, v5 : `order` à la racine) |
| `/competences/[slug]` | `app/competences/[slug]/page.tsx` | **Rendu conditionnel** : si au moins une entrée `realisation-ia` est liée à la compétence (filtre API sur le slug), **grille de vignettes** (même rythme visuel que le portfolio) ; sinon fiche richtext historique via `ContentSectionCompetencesContainer` |
| `/competences/[slug]/[realisation]` | `app/competences/[slug]/[realisation]/page.tsx` | Fiche d'une **réalisation** (collection Strapi `realisation-ia`) : réutilise `ContentSection` comme les projets (carousel, Markdown `resum` ou `Resum`, CTA `link` externe) |
| `/contact` | `app/contact/page.js` | Formulaire → `/api/contact` (Brevo, voir `contact-flow.md`) |
| `/api/contact` | `app/api/contact/route.ts` | Endpoint serveur : envoie un email via Brevo, honeypot + rate-limit |
| `/api/proxy` | `app/api/proxy/route.js` | Proxy GET vers API LLM distante |

**Strapi — content-types concernés :**

- `competence` : `name`, `content` (richtext), `picture`, `slug`, `order` — exemple de slug public / vault : `transcription-audio-fgc-transcription` (Transcription audio FGC).
- `realisation-ia` : `name`, `description`, `picture`, `slug`, `resum` (richtext, alias accepté côté front : `Resum` pour les `project` uniquement), `link`, `order`, relation `competences` (plusieurs)
- Vignette → toujours navigation vers la **fiche détail** interne ; le champ `link` sert de bouton *Voir plus* en bas de fiche (comme sur les fiches `project`).

## Layout

- `app/layout.tsx` — **Client Component** (`"use client"`). Header fixe, menu burger mobile, fond décoratif, **Footer**, compteur de visites **localStorage** (`visitCount`).

## Données Strapi

- **`getApiUrl()`** (`app/utils/getApiUrl.ts`) :  
  - Côté **navigateur** : si hostname est local / LAN → `http://localhost:1337`, sinon → `https://api.fernandgrascalvet.com`.  
  - Côté **serveur** : `process.env.NEXT_PUBLIC_API_URL` ou défaut `https://api.fernandgrascalvet.com`.
- **`fetchData`** (`app/utils/fetchData.ts`) : collection + `slug`, populate `picture`, `cache: "no-store"`.
- **Accueil** (`app/page.tsx`) : `homepages`, retry 3×, timeout 10 s.

## Configuration Next

- `next.config.ts` : `rewrites` de `/api/:path*` vers `${API_URL}/api/:path*` où `API_URL` vient de `NEXT_PUBLIC_API_URL` ou défaut production.
- **`next/image`** : `images.remotePatterns` vers les chemins **`/uploads/**`** de l’API Strapi (HTTPS prod + `localhost` / `127.0.0.1:1337` en dev) ; `formats` AVIF/WebP ; **`compress: false`** (compatibilité reverse proxy IIS — voir [`09-performances-images.md`](./09-performances-images.md) §4.1).
- **Médias Strapi** : utilitaire **`pickStrapiImage`** (`app/utils/strapiImage.ts`) pour préférer les variantes `medium` / `large` selon le contexte (liste, hero, galerie).
- Plan **Server Components** (données Strapi), non implémenté : [`10-plan-server-components.md`](./10-plan-server-components.md).

## Composants notables

- Carrousels : `Carousel.tsx`, `CarouselCompetences.tsx` (swiper / react-responsive-carousel).
- Sections : `ContentSection.tsx`, `ContentSectionCompetences*.tsx`.
- `ContactForm.tsx` → `POST /api/contact` → Brevo API (voir `docs-site-interne/contact-flow.md`).
- `GrasBotFab` + `ChatBot.js` → `askAI.js` → `/api/proxy` → FastAPI `/ask` avec `session_id` + `user_id` (UUID anonymes via `app/utils/grasbotIds.js`, voir `docs-site-interne/langfuse-observability.md`).
- `ModalGlossaire.tsx` — glossaire (données Strapi selon usage dans les pages).

## Fichiers clés (liste courte)

```
app/layout.tsx
app/page.tsx
app/utils/getApiUrl.ts
app/utils/strapiImage.ts
app/utils/fetchData.ts
app/api/contact/route.ts
next.config.ts
```
