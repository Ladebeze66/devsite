# Audit performances images & dev mode

**Dernière mise à jour :** 2026-04-28 (révision compression IIS/Next + lien plan SC)
**Statut :** lots **A, B, C** et socle du lot **F** réalisés dans le code Next ; inventaire médias (Lot **D**) et autres lots **non** faits sauf mention.

> Document hybridé : conserve l’audit historique (§2 inventaire médias inchangé
> tant qu’on n’a pas re-mesuré `cmsbackend/public/uploads/`). Les §3–4 reflètent
> l’implémentation actuelle après l’itération perf front.

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

## 3. Comment les images sont consommées par Next (état courant)

### 3.1 Utilitaire `pickStrapiImage` (`app/utils/strapiImage.ts`)

Toute lecture d’un média Strapi passant par le front doit préférer une **variante**
à l’original :

| Preset | Usage typique | Ordre de préférence |
|--------|----------------|---------------------|
| `card` | Grilles liste portfolio / compétences / vignettes `realisation-ia` | `medium` → `small` → `thumbnail` → original |
| `hero` | Portrait hero home | `large` → `medium` → `small` → original |
| `full` | Galeries fiche projet, compétence, glossaire (carousel détail) | `large` → `medium` → `small` → original |

Les pages et composants listés au §3.2 appellent cet utilitaire puis
construisent une URL absolue avec `getApiUrl()`. Si Strapi ne renvoie pas de
bloc `formats` (upload incomplet ou vieux contenu), on retombe sur
`formats.large ?? url` comme avant pour les zones **déjà** codées ainsi.

### 3.2 `next/image` + `sizes`

**Import** `next/image` utilisé pour les flux suivants :

- **`app/page.tsx`** — portrait hero : `fill` dans un bloc dimensionné +
  **`priority`** (LCP).
- **`app/portfolio/page.jsx`**, **`app/competences/page.jsx`**,
  **`app/competences/[slug]/page.tsx`** — vignettes : `fill` +
  `sizes` adaptatif.
- **`VignetteCarousel.tsx`**, **`Carousel.tsx`**, **`CarouselCompetences.tsx`**
  — slides Swiper en `fill` avec `sizes` ; la **lightbox** reste une **`<img>`**
  native (zoom plein cadre sans contraintes de dimensions Next).

**Non couvert dans ce lot** : `placeholder="blur"` avec `blurDataURL` dérivé
de `formats.thumbnail` (restait dans le périmètre « idéal » du lot F
historique).

### 3.3 Configuration `next.config.ts`

- **`images.remotePatterns`** vers `uploads/**` pour
  **`https://api.fernandgrascalvet.com`**, **`http://localhost:1337`** et
  **`http://127.0.0.1:1337`** (aligné sur `getApiUrl()` en dev).
- **`images.formats`** : `image/avif`, `image/webp`.
- Ancienne clé **`images.domains`** : retirée (dépréciée depuis Next 14).

Référence code : fichier `next.config.ts` à la racine du dépôt Next.

---

### Ancien diagnostic (archivé pour mémoire)

Avant cette itération, les listes chargeaient surtout **`img.url`** (original)
sans variantes Strapi ni `next/image`. Les métriques de l’inventaire §2 restent
utiles tant que les **originaux** côté disque sont lourds (PNG) : même avec des
variantes bien choisies, Strapi régénère souvent ces variantes **dans le même
format** que l’original — une conversion fichier (Lot **E**) reste pertinente
pour réduire le stockage total.

### 3.4 Toutes les pages sont `"use client"` + `useEffect`-fetch

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
> initial — le navigateur lance les requêtes images en parallèle du JS. Plan détaillé :
> [`10-plan-server-components.md`](./10-plan-server-components.md).

## 4. Mode `dev` : impact réel

L'utilisateur souhaite **rester en dev pour le moment** — c'est noté. Voici
ce que ça coûte vraiment, du plus marquant au moins marquant.

### 4.1 Compression HTTP (Next) et reverse proxy IIS

**Décision effective (diagnostic avril 2026, exposition HTTPS derrière IIS) :** **`compress: false`**
dans `next.config.ts` (état actuel du dépôt).

- Un passage à **`compress: true`** a provoqué des **HTTP 500** côté
  **navigateur** alors que Next loguait **`GET / 200`** : la réponse **gzip**
  générée par Next n'était **pas** correctement gérée par la chaîne
  **IIS + URL Rewrite + ARR** vers `http://localhost:3000` (buffer / en-têtes /
  double traitement).
- La **compression dynamique IIS**, une fois son module installé, **n’a pas été
  retenue** comme substitution fiable sur ce périmètre non plus tant que la combinaison
  tunnel + Next n’a pas été retestée de façon isolée.

> Tant que le site est exposé **derrière IIS de cette façon**, ne pas réactiver
> **`compress: true`** côté Next sans **test** sur **`https://fernandgrascalvet.com`**.
> Le léger surplus de transfert brut **localhost ⇄ IIS** est acceptable en dev/serveur.

### 4.1b IIS — compression (référence)

- **Compression statique** : peut rester active sur les sites IIS (fichiers
  servis directement par IIS) ; hors scope du corps HTML proxifié vers Next.
- **Compression dynamique** : module séparé (rôle serveur Web) ; **ne remplace pas**
  le problème **`Content-Encoding`** venant de Next si un jour on réactive gzip côté app.

Le mode `next dev` reste sans minification agressive du JS (voir §4.2).

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

> **Constat n° 4 (révisé encore) :** on garde **`compress: false`** côté Next
> pour éviter les **500 IIS** derrière reverse proxy ; le surplus de transfert HTML/JSON non gzip
> entre IIS et localhost est préféré à une page publique cassée.
> Le reste du mode `dev` reste plus lourd qu’une **build prod** (bundle JS, pas de data cache
> Next sur les pages entièrement client).

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

### 5.2 Portrait hero et LCP

**Partiellement traité (2026-04-28) :** le portrait utilise **`next/image`**
avec **`priority`** dans `app/page.tsx` (pas de `rel=preload` séparé). Le fetch
home reste **client** (`useEffect`) — le gain LCP complet viendra surtout avec
le lot **G** (Server Components).

### 5.3 Preconnect vers l’API Strapi

**Fait (2026-04-28) :** `app/layout.tsx` injecte
`<link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || URL prod par défaut} crossOrigin="" />`
pour l’origine API (médias + JSON). En local, si `.env` pointe vers
`http://localhost:1337`, le preconnect cible ce host.

### 5.4 Wallpaper OK, alternatives mortes

`app/assets/images/wallpapersite_resultat.webp` ≈ **620 KB** — déjà WebP,
correct pour un fond plein écran. Le `wallpapersite.png` à côté pèse
6,8 MB et n'est plus utilisé : à supprimer.

## 6. Plan d'action proposé (du plus rentable au plus structurel)

Tri par ratio gain / effort. À discuter avant exécution.

### Quick wins (≤ 1 h, gros gains)

- [x] **Lot A — Lire les variantes Strapi côté Next.**
  Implémenté via **`pickStrapiImage`** (`app/utils/strapiImage.ts`) et branchements
  listes + carousels + fiches (voir §3). **À re-mesurer** sur `/portfolio` et
  `/competences` (Network → Img) après redémarrage des services.
- [ ] **Lot B — Compression Next (`compress`) — annulé dans cette forme.**
  Tentative **`compress: true`** puis **rétablissement à `false`** : conflit avec
  reverse proxy IIS (**500** public). Voir §4.1.
- [x] **Lot C — `preconnect` API Strapi.**
  Lien dans `app/layout.tsx`, origine pilotée par **`NEXT_PUBLIC_API_URL`**
  avec repli sur l’API de production.

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

- [x] **Lot F — Migration `<img>` → `next/image` (socle).**
  Fait pour les flux principaux (listes, carousels, hero) + **`remotePatterns`**
  + **`formats` AVIF/WebP**. **Non fait :** `deviceSizes` explicites (défaut
  Next), **`placeholder="blur"`** — laissé en dette optionnelle.

### Lots structurels (½ journée +)

- [ ] **Lot G — Server Components pour `/portfolio`, `/competences` et `/`.**
  Convertir les pages en composants async serveur, déplacer le `useEffect`
  vers un sous-composant client uniquement pour l'interactivité (carousels,
  modal). Bénéfices : HTML initial complet, fetch caché serveur, pas de
  spinner au premier paint. Compatible avec Lot F (`next/image priority`).
  **Plan rédigé :** [`10-plan-server-components.md`](./10-plan-server-components.md).

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

## 8. Suite / dettes

- **Contenu Strapi** : harmonisation des médias et WebP côté CMS faite par l’auteur
  — l’inventaire §2 n’a pas été **re-mesuré** ; relancer un passage sur
  `cmsbackend/public/uploads/` si besoin de chiffres à jour.
- **Lot D** — script `strapi_extraction/audit-images.js` : **pas écrit**.
- **Lot E** — conversion + ré-upload : **hors code Next** ; voir pipeline
  `strapi_extraction/media-sync` si utilisé pour le remplacement ciblé.
- **Lot G** — Server Components sur `/`, `/portfolio`, `/competences` : **à faire**
  (voir [`10-plan-server-components.md`](./10-plan-server-components.md)).
- **Lots H / I** : inchangés (plugin Strapi upload, purge `app/assets/images/`).

Prochaine amélioration doc utile : captures **avant/après** réseau dans
`docs-site-interne/captures/perf/` une fois les services redémarrés et le
parcours manuel validé.

## 9. Liens internes

- Migration Server Components (plan) :
  [`10-plan-server-components.md`](./10-plan-server-components.md)
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
