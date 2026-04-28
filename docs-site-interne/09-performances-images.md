# Audit performances images & dev mode

**Dernière mise à jour :** 2026-04-28
**Statut :** diagnostic — aucune modification du code n'est encore appliquée.

> Document d'analyse à l'origine d'un futur lot de corrections. À mettre à jour
> au fur et à mesure que les actions sont réalisées (cocher les cases).

## 1. Contexte du problème

Sur certains navigateurs (notamment ceux qui ne sont pas Chromium ou en
connexion limitée), les pages `portfolio/`, `competences/` et la home mettent
plusieurs secondes à afficher leurs visuels. L'hypothèse de départ était :

- **« les images devraient déjà être en WebP »** ;
- **« Strapi en dev ralentit la livraison des images »** ;
- **« Next + Strapi tournent en `dev`, ce qui dégrade les perfs »**.

Le diagnostic ci-dessous valide partiellement ces hypothèses et en révèle
d'autres, plus structurelles, qui pèsent davantage que le mode `dev`.

## 2. Inventaire des médias Strapi (mesure)

Mesures faites sur `cmsbackend/public/uploads/` (28/04/2026).

### 2.1 Vue globale

| Catégorie | Fichiers | Poids |
|---|---:|---:|
| **Total uploads** | 2 603 | **1 034,6 MB** |
| Originaux (sans variantes responsive) | 523 | 569,6 MB |
| Variantes responsive Strapi (`thumbnail_/small_/medium_/large_`) | 2 079 | 465,0 MB |

### 2.2 Originaux par format

| Extension | Fichiers | Poids | Statut |
|---|---:|---:|---|
| `.webp` | 252 | 92,5 MB | ✅ converti |
| `.jpg`  | 59  | 39,4 MB | ⚠️ à convertir |
| `.png`  | 212 | **437,6 MB** | 🔴 à convertir en priorité |

**190 PNG dépassent 1 MB** (424 MB cumulés), avec un top 10 entre 3 et 4 MB
par fichier (ex. `vase_*.png` à 4,25 MB, illustrations Midjourney à 3,5 MB).

> **Constat n° 1 :** l'hypothèse « tout est déjà en WebP » est fausse. **271
> originaux non-WebP** représentent **84 %** du poids des originaux. La
> conversion ciblée des PNG > 1 MB suffirait à diviser le total par 3 ou 4.

### 2.3 Variantes responsive Strapi

| Variante | Fichiers | Poids |
|---|---:|---:|
| `large_*`     | 518 | 242,9 MB |
| `medium_*`    | 518 | 139,6 MB |
| `small_*`     | 520 |  65,7 MB |
| `thumbnail_*` | 523 |  16,9 MB |

Strapi génère bien ces variantes — mais **dans le format de l'original**. Donc
un `.png` de 4 MB produit un `large_…png` de ~1 MB, alors qu'une version
WebP serait à ~150-300 KB pour la même qualité perçue.

## 3. Comment les images sont consommées par Next

### 3.1 Toujours `img.url` (l'original), jamais les variantes

`app/portfolio/page.jsx` (vignettes en grille) :

```132:137:app/portfolio/page.jsx
                    <img
                      src={firstImage.url}
                      alt={firstImage.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
```

Même pattern dans :

- `app/competences/page.jsx` (ligne ~127)
- `app/competences/[slug]/page.tsx` (ligne ~229)
- `app/components/Carousel.tsx` (ligne ~81 + lightbox 120)
- `app/components/CarouselCompetences.tsx` (ligne ~69 + lightbox 108)
- `app/components/VignetteCarousel.tsx` (ligne ~58)
- `app/page.tsx` (portrait hero, ligne 124)

**Aucun de ces composants ne lit `formats.thumbnail.url`, `formats.small.url`,
`formats.medium.url` ni `formats.large.url`** — Strapi a déjà fait le travail
de redimensionnement, on l'ignore.

> **Constat n° 2 :** une carte de portfolio en grille charge un PNG ~3 MB
> alors qu'on l'affiche en 400×300 px. La variante `medium_` (~300 KB) ou
> `small_` (~120 KB) suffirait — gain immédiat de **~10× sur le poids
> transféré**, sans toucher aux fichiers stockés.

### 3.2 `<img>` natif partout — `next/image` jamais utilisé

`grep` confirme : **aucun `import Image from "next/image"`** dans tout `app/`.
Conséquence :

- pas de `srcset`/`sizes` automatique (le navigateur télécharge la même image
  en mobile qu'en desktop) ;
- pas de placeholder `blur` ;
- pas de conversion à la volée vers AVIF/WebP via le runtime image de Next ;
- aucune dimension donnée (`width`/`height`) → CLS (Cumulative Layout Shift)
  potentiel pendant le chargement.

`next.config.ts` autorise pourtant `localhost` et `api.fernandgrascalvet.com`
dans `images.domains` — la migration est donc partiellement amorcée mais
inutilisée :

```24:26:next.config.ts
  images: {
    domains: ["localhost", "api.fernandgrascalvet.com"],
  },
```

Note : `domains` est **déprécié** depuis Next 14 ; il faudra basculer vers
`remotePatterns` au moment de la migration (et préciser
`formats: ['image/avif', 'image/webp']`).

### 3.3 Toutes les pages sont `"use client"` + `useEffect`-fetch

`app/page.tsx`, `app/portfolio/page.jsx`, `app/competences/page.jsx`,
`app/competences/[slug]/page.tsx` : toutes commencent par `"use client"` et
font `fetch()` côté navigateur dans `useEffect`. Conséquences :

1. **First paint sans données** → on voit toujours le spinner ou les
   squelettes, même quand Strapi répond vite. Le ressenti « ça rame » vient
   en partie de là, indépendamment du poids des images.
2. Le HTML initial **ne contient aucune `<img>`** → le navigateur ne peut pas
   préfetcher les visuels pendant le parsing HTML.
3. Pas de cache Next (`fetch` côté client = cache navigateur uniquement,
   pas le data cache de Next).

> **Constat n° 3 :** migrer ces pages en **Server Components** (fetch dans le
> composant async + `revalidate: 60`) résoudrait à la fois le ressenti de
> lenteur **et** la latence images, puisque les `<img>` seraient dans le HTML
> initial — le navigateur lance les requêtes images en parallèle du JS.

## 4. Mode `dev` : impact réel

L'utilisateur souhaite **rester en dev pour le moment** — c'est noté. Voici
ce que ça coûte vraiment, du plus marquant au moins marquant.

### 4.1 Compression HTTP désactivée explicitement (Next)

```9:12:next.config.ts
const nextConfig = {
  reactStrictMode: true,
  compress: false,
  trailingSlash: false,
```

`compress: false` désactive **gzip/brotli** côté Next — y compris en
production. Pour du JSON Strapi de 50 KB ou un bundle JS de 500 KB, c'est un
facteur 4 à 8 sur le poids transféré. **À retirer ou passer à `true` même
en dev.**

### 4.2 `next dev --turbopack`

Coût : pas de minification, pas de tree-shaking, sourcemaps, modules
instrumentés HMR. **Impact net :** bundle JS ~3-5× plus lourd qu'en prod,
mais ça ne touche pas les images. Visible surtout au premier chargement de
l'app.

### 4.3 `strapi develop`

- watcher tsc + reload admin sur chaque écriture ;
- logs verbeux ;
- pas de cache compilé — chaque requête ré-exécute le pipeline middlewares
  complet.

**Impact sur les images :** marginal (sharp redimensionne et met en cache
les variantes au premier upload, pas à chaque requête). Strapi dev est
**lent à démarrer**, pas lent à servir un fichier statique.

### 4.4 Aucun cache HTTP côté Strapi

Le middleware `strapi::public` sert `cmsbackend/public/uploads/` sans
`Cache-Control` long terme. Chaque revisite re-télécharge potentiellement
l'image (selon ETag). C'est aggravé en dev car les builds suivants
invalidant tout. **Voir `cmsbackend/config/middlewares.ts`** :

```19:26:cmsbackend/config/middlewares.ts
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

> **Constat n° 4 :** en dev, l'impact « gros » est `compress: false`. Le
> reste du dev mode est inconfortable au démarrage mais n'explique pas la
> lenteur image perçue.

## 5. Autres pistes détectées en cours d'audit

### 5.1 `app/assets/images/` pèse 992 MB dans le repo

```
339 fichiers — 992,4 MB
  .png : 137 fichiers — 871,7 MB  (médianes ~3-10 MB par fichier)
  .webp: 168 fichiers —  73,9 MB
  .jpg :  33 fichiers —  46,8 MB
```

Dossier hérité de l'époque où les images étaient bundlées dans le code
Next. Aujourd'hui les pages tirent depuis Strapi, donc **ces PNG sont
probablement morts** mais alourdissent : `git clone`, sauvegardes, indexation
IDE, et potentiellement `next build` s'ils sont importés depuis un fichier
encore référencé. À auditer (`grep` sur les imports) puis purger ou archiver.

### 5.2 Pas de `link rel="preload"` pour le portrait hero

`app/page.tsx` (home) affiche un portrait via `<img>` après fetch
client-side. Sur la home, c'est l'image principale au-dessus de la ligne de
flottaison ; un preload (ou un Server Component + `next/image priority`)
ferait gagner ~200-500 ms de TTI sur le LCP.

### 5.3 Pas de hint réseau vers `api.fernandgrascalvet.com`

Aucun `<link rel="preconnect" href="https://api.fernandgrascalvet.com">`
dans `app/layout.tsx`. Le premier round-trip image en prod paye le DNS +
TLS handshake en série ; un preconnect le déclenche pendant le parsing
HTML.

### 5.4 Wallpaper OK, alternatives mortes

`app/assets/images/wallpapersite_resultat.webp` ≈ **620 KB** — déjà WebP,
correct pour un fond plein écran. Le `wallpapersite.png` à côté pèse
6,8 MB et n'est plus utilisé : à supprimer.

## 6. Plan d'action proposé (du plus rentable au plus structurel)

Tri par ratio gain / effort. À discuter avant exécution.

### Quick wins (≤ 1 h, gros gains)

- [ ] **Lot A — Lire les variantes Strapi côté Next.**
  Modifier les 6 emplacements `<img src={img.url}>` pour préférer
  `img.formats?.medium?.url ?? img.formats?.small?.url ?? img.url`.
  Ajouter une fonction utilitaire `pickStrapiImage(picture, "card" | "thumbnail" | "full")`
  dans `app/utils/`. **Gain attendu :** ÷ 5 à ÷ 10 sur le poids des grilles
  de portfolio/compétences. Aucune perte qualité (les variantes sont
  dimensionnées par Strapi à partir des originaux).
- [ ] **Lot B — Activer la compression Next.**
  Passer `compress: false` → `compress: true` dans `next.config.ts`.
  **Gain attendu :** ÷ 4 sur le JSON Strapi et le HTML.
- [ ] **Lot C — `preconnect` API Strapi.**
  Ajouter `<link rel="preconnect" href="https://api.fernandgrascalvet.com" crossOrigin="" />`
  dans `app/layout.tsx`. **Gain attendu :** ~150-300 ms sur le TTFB des
  images en prod, négligeable en local.

### Lots moyens (1-3 h chacun)

- [ ] **Lot D — Script d'inventaire & conversion WebP.**
  Nouveau script `strapi_extraction/audit-images.js` qui :
  1. parcourt `cmsbackend/public/uploads/` ;
  2. identifie les originaux non-WebP > seuil (1 MB par défaut) ;
  3. classe par section (en croisant avec
     `extract/raw/projects-raw.json`, `competences-raw.json`,
     `homepages-raw.json`) → produit
     `strapi_extraction/extract/images-by-section/<section>/<slug>.json` ;
  4. exporte un rapport `images-audit.md` (top n par poids, par section,
     fichiers orphelins).
  **Pas de conversion automatique au premier passage** — juste l'inventaire,
  pour que l'utilisateur puisse vérifier la classification avant action.

- [ ] **Lot E — Conversion + ré-upload contrôlé.**
  Une fois l'inventaire validé : second script
  `strapi_extraction/convert-and-reupload.js` qui :
  1. convertit les fichiers ciblés via `sharp` (qualité 80, conserve les
     dimensions) → écrit dans `extract/converted/` ;
  2. ré-upload via l'API REST Strapi (`POST /api/upload`) avec
     `ref`/`refId`/`field` pour rattacher à la bonne entité ;
  3. supprime l'ancien original via `DELETE /upload/files/:id` après
     vérification.
  **Réversibilité :** le script garde les originaux dans `extract/backup/`
  jusqu'à validation manuelle.

- [ ] **Lot F — Migration `<img>` → `next/image`.**
  Remplacer les 6 occurrences. Mettre à jour `next.config.ts` :
  `domains` → `remotePatterns`, ajouter
  `formats: ['image/avif', 'image/webp']`, définir `deviceSizes` cohérents
  avec les breakpoints Tailwind. Ajouter `priority` au portrait hero,
  `placeholder="blur"` (avec `blurDataURL` provenant de `formats.thumbnail`).

### Lots structurels (½ journée +)

- [ ] **Lot G — Server Components pour `/portfolio`, `/competences` et `/`.**
  Convertir les pages en composants async serveur, déplacer le `useEffect`
  vers un sous-composant client uniquement pour l'interactivité (carousels,
  modal). Bénéfices : HTML initial complet, fetch caché serveur, pas de
  spinner au premier paint. Compatible avec Lot F (`next/image priority`).

- [ ] **Lot H — Plugin Strapi pour conversion WebP à l'upload.**
  Configurer `@strapi/provider-upload-local` (ou un plugin custom) pour
  forcer la conversion WebP des nouveaux uploads via sharp. Évite la
  ré-introduction de PNG bruts à l'avenir. **Hors scope du dev local
  immédiat — à faire avant de remettre en prod.**

- [ ] **Lot I — Nettoyage `app/assets/images/`.**
  Identifier les fichiers encore importés (`grep` sur les chemins).
  Archiver (zip externe) le reste. Gain : ~900 MB sur le repo.

## 7. Métriques avant/après à capturer

À la fin de chaque lot, mesurer :

- Poids total transféré sur `/portfolio` (DevTools → Network → "Img"), en
  cache vide et en cache plein ;
- LCP et CLS via Lighthouse en mode mobile/3G simulé ;
- Time-to-interactive sur Firefox + Safari (les navigateurs cibles
  signalés comme problématiques).

Stocker les captures dans `docs-site-interne/captures/perf/` avec le
nom `<lot>-<avant|apres>.webp`.

## 8. Ce que ce document **ne** fait pas (encore)

- Aucune ligne de code modifiée — c'est un audit.
- Le script `strapi_extraction/audit-images.js` (Lot D) reste à écrire.
- Les conversions WebP (Lot E) restent à faire.

À la prochaine itération : créer le script d'audit images en s'inspirant
de la structure de `strapi_extraction/extract-api-data.js` (même style de
log, même répertoire `extract/`, même résumé JSON final).

## 9. Liens internes

- Pipeline d'extraction Strapi existant :
  [`06-strapi-extraction.md`](./06-strapi-extraction.md)
- Architecture globale & ports :
  [`01-architecture.md`](./01-architecture.md)
- Doc front Next :
  [`02-frontend-next.md`](./02-frontend-next.md)
- État courant du chantier :
  [`etat-actuel.md`](./etat-actuel.md)
- Roadmap :
  [`feuille-de-route.md`](./feuille-de-route.md)
