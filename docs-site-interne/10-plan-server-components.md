# Plan — migration vers Server Components (données Strapi)

**Dernière mise à jour :** 2026-04-28  
**Statut :** document de planification — **aucun changement de code appliqué** dans ce lot ; mise en œuvre quand vous le déciderez.

**Prérequis lu :** vous restez en **`npm run dev`** (Turbopack) pour le moment ; ce document décrit aussi ce que donne **`next build` / `next start`** en complément.

---

## 1. Objectif

Réduire le pattern actuel : pages marquées **`"use client"`** qui appellent **`fetch()` dans `useEffect`** après hydration.

Vers : **`async`** page (ou composant serveur parent) qui appelle **`fetch`** **côté serveur Next**, avec mise en **`cache`/revalidation** possible, puis rendu HTML **déjà rempli** de contenu texte + balises images.

---

## 2. État actuel (référence doc + code)

| Page / zone | Fichier | Pattern actuel |
|-------------|---------|----------------|
| Accueil | `app/page.tsx` | `"use client"` + `useEffect` → `getHomepageData()` |
| Liste portfolio | `app/portfolio/page.jsx` | idem → `/api/projects` |
| Liste compétences | `app/competences/page.jsx` | idem → `/api/competences` |
| Compétence (vignettes réalisations) | `app/competences/[slug]/page.tsx` | idem, fetchs multiples |

Conséquences documentées dans [`09-performances-images.md`](./09-performances-images.md) §3.4 : premier paint sans données, pas de data cache Next sur ces flux, images découvertes tard.

---

## 3. Ce que « Server Components » implique (concrètement)

### 3.1 Principe

- Un **Server Component** est un composant **sans** `"use client"` qui peut être **`async`** et utiliser **`await fetch(...)`** directement dans le corps du composant.
- Le rendu s’exécute **sur le serveur Node** (processus Next), **une fois par requête** (sauf cache), pas dans le navigateur.

### 3.2 Ce qui reste **obligatoirement** en Client Components

Tout ce qui utilise des **hooks** React hors contexte « serveur » limité : **`useState`**, **`useEffect`**, **`useRef`** pour le menu mobile, événements clavier (**Escape**), **Swiper**, **portal** pour modales, **localStorage**, etc.

**Stratégie classique :** fichier page **sans** `"use client"` (serveur), qui **`await`** les données puis rend :

```txt
<>
  <PageHeader … />           // peut être serveur
  <ListeClientOuMixte … />    // sous-arbre `"use client"` uniquement où nécessaire
</>
```

Les **carousels** (`Carousel`, `VignetteCarousel`) restent très probablement en **clients** tant qu’ils dépendent de Swiper avec effets hydratés — on leur **passe en props** les URLs / textes déjà résolus côté serveur.

### 3.3 **Layout root** (`app/layout.tsx`)

Aujourd’hui : **`"use client"`** (+ menu burger, état drawer, etc.). **Option A :** garder le layout tel quel et ne migrer **que les pages feuilles** — Next autorise une page serveur même si le layout parent est client (limites : enfants peuvent être serveur sous certaines compositions ; selon Next 13–15 il faut vérifier qu’aucune contrainte n’« impose » tout client — en pratique souvent extraction **ServerLayout** léger OU **layouts par segment** `/portfolio/layout.tsx` serveur). **Option B (plus tard) :** scinder en **layout serveur** + **header/footer client** importés dynamiquement ou composants clients enfants.

C’est le point le plus **structurant** ; il sera arbitré au moment de l’implémentation (lot par lot).

### 3.4 Appels Strapi : URL

- **Côté serveur Next**, **`getApiUrl()`** sans `window` utilise **`NEXT_PUBLIC_API_URL`** (ou défaut prod). Pour le dev **sur la même machine**, s’assurer que cette env pointe soit vers **`http://localhost:1337`**, soit vers l’URL publique **si** IIS/Strapi le servent aussi — sinon risque que le SSR appelle **`https://api.fernand…`** depuis le serveur sans route réseau correcte (**variable d’env par environnement** recommandée).
- Harmoniser avec **rewrites** existants **`/api/*` → Strapi** : possibilité d’utiliser **`fetch(new URL('/api/...', request.url ?? base))`** en SSR si vous préférez passer par Next (même origin).

### 3.5 `fetch` et cache

- **`fetch(url, { next: { revalidate: 60 } })`** : ISR-like, données rafraîchies au plus toutes les **60** secondes selon docs Next 15 (`cache` par défaut a évolué — à relire [`next` doc](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching) au moment du codage).
- Pour du **toujours frais en dev**, **`cache: 'no-store'`** peut rester le comportement désiré jusqu’à validation.

### 3.6 Mode **`dev`** (Turbopack)

- Les Server Components **fonctionnent** en `next dev` ; le **cache** `fetch` est **moins représentatif** de la prod qu’avec `next start`.
- Le **gain perçu** (HTML complet, moins de waterfall client) reste **visible** en dev sur le **réseau** / **Elements** (contenu dans le HTML source).

---

## 4. Gains réels attendus

| Dimension | Avant (client fetch) | Après (données en serveur) |
|-----------|----------------------|----------------------------|
| **Premier contenu** | Spinner / squelette jusqu’à fin de `fetch` + JSON parse côté client | Texte + structure + **images** (`next/image` avec `src` déjà dans le HTML) plus tôt |
| **Waterfall** | HTML minimal → chargement JS → `useEffect` → fetch → re-render | Un aller-retour serveur Strapi lors du SSR Next (possible parallélisation `Promise.all`) |
| **Cache Next** | Aucun data cache pour ces pages | Possibilité **revalidate** / tags plus tard |
| **SEO / réseaux lents** | Contenu peu présent sans exécuter JS | Contenu lisible avec HTML seul (**meilleur** pour indexation ; utile même si votre besoin SEO est modeste) |
| **Lighthouse LCP** | Portrait / hero souvent retardé par la chaîne client | Déjà dans le flux initial SSR (**souvent gain LCP** mesurable après stabilisation)

**Limite honnête :** **`next dev`** conserve un JS **volumeux** (Turbopack, pas minifié comme prod). Le gain **bundle** sera **maximum** après **`next build` + `next start`** (ou équivalent).

---

## 5. Ordre de migration proposé (par risque croissant)

1. **`/portfolio`** (liste seule — une liste, pattern clair).
2. **`/competences`** (liste identique).
3. **`/`** (home — `getHomepageData` + retry ; extraire logique fetch dans `lib/` serveur).
4. **`/competences/[slug]`** (deux modes : vignettes réalisations vs redirect vers container compétences — attention aux branches).

Ensuite : fiches détail **`ContentSection`** / **`fetchData`** peuvent suivre une feuille de route analogue (nombreuses pages déjà partiellement factorisées via `fetchData`).

À chaque étape : **tests manuels** des routes, erreurs réseau Strapi, **images** encore correctes (**`pickStrapiImage`** inchangé côté props).

---

## 6. Hors scope immédiat (rappels)

- **Ne pas** renommer tous les fichiers **`.jsx`→`.tsx`** en même temps sans besoin ; migrer fichier par fichier.
- **Ne pas** activer **`compress: true`** côté Next tant que derrière **ARR/IIS** le tunnel reste incompatible (voir [`09-performances-images.md`](./09-performances-images.md) §4.6).
- **Évaluation `next build`** : à planifier après stabilisation SSR en dev ou sur une branche.

---

## 7. Liens internes

- Audit perf images & IIS : [`09-performances-images.md`](./09-performances-images.md)  
- Front Next synthèse : [`02-frontend-next.md`](./02-frontend-next.md)  
- Feuille de route : [`feuille-de-route.md`](./feuille-de-route.md)  
- État actuel stack : [`etat-actuel.md`](./etat-actuel.md)
