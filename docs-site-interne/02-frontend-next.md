# Frontend Next.js

**Dernière mise à jour :** 2026-04-01

## Stack

- **Next.js** 15.x, **React** 18, **TypeScript** (fichiers `.tsx`/`.ts`) avec fichiers **`.jsx`/`.js`** encore présents.
- **Tailwind CSS** + `@tailwindcss/typography`.
- Rendu riche Strapi : `@strapi/blocks-react-renderer`, **react-markdown** + rehype/remark.

## Routes (App Router)

| Chemin | Fichier | Notes |
|--------|---------|--------|
| `/` | `app/page.tsx` | Accueil : `GET /api/homepages?populate=*` |
| `/portfolio` | `app/portfolio/page.jsx` | Liste projets |
| `/portfolio/[slug]` | `app/portfolio/[slug]/page.tsx` | Détail projet (`fetchData('projects', slug)`) |
| `/competences` | `app/competences/page.jsx` | Liste compétences |
| `/competences/[slug]` | `app/competences/[slug]/page.tsx` | Détail (`fetchData('competences', slug)`) |
| `/contact` | `app/contact/page.js` | Formulaire → Strapi `messages` |
| `/admin/messages` | `app/admin/messages/page.tsx` | Consultation messages (côté Next) |
| `/api/proxy` | `app/api/proxy/route.js` | Proxy GET vers API LLM distante |

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
- `images.domains` : `localhost`, `api.fernandgrascalvet.com`.

## Composants notables

- Carrousels : `Carousel.tsx`, `CarouselCompetences.tsx` (swiper / react-responsive-carousel).
- Sections : `ContentSection.tsx`, `ContentSectionCompetences*.tsx`.
- `ContactForm.tsx` → `sendMessage.ts`.
- `ChatBot.js` → `askAI.js` → `/api/proxy`.
- `ModalGlossaire.tsx` — glossaire (données Strapi selon usage dans les pages).

## Fichiers clés (liste courte)

```
app/layout.tsx
app/page.tsx
app/utils/getApiUrl.ts
app/utils/fetchData.ts
app/utils/sendMessage.ts
next.config.ts
```
