# Refonte visuelle — Direction "Digital Atelier"

**Créé :** 2026-04-22  
**Statut :** terminé — 8/8 étapes (2026-04-22)  
**Source d'inspiration :** `stitch_V1/` (design newsletter Stitch — `DESIGN.md` et `code.html`).  
**Audit préalable :** [`captures/AUDIT-VISUEL.md`](./captures/AUDIT-VISUEL.md).

## 1. Règle de garde-fou (validée utilisateur)

> **On emprunte au Stitch la direction artistique** (palette, typographie, layering tonal, radius, ombres ambient) **et deux ou trois composants signatures** (frame image, pull-quote, bouton jewel). **On n'emprunte ni la mise en page en colonne unique, ni la bottom nav, ni le rythme vertical newsletter.** Le **wallpaper** et le couple **header / drawer mobile** du site restent la fondation.

Concrètement, `stitch_V1/DESIGN.md` fait foi (système). `stitch_V1/code.html` sert d'illustration : il ne fait pas foi quand il contredit `DESIGN.md` (ex. il utilise des `border border-outline-variant` que DESIGN.md interdit — règle "No-Line").

Chaque commit de refonte doit être relisable à l'aune de cette règle : s'il introduit une colonne unique `max-w-xl` globale, une bottom nav ou des bordures 1px opaques, il est à corriger.

## 2. Arbitrages actés

| Sujet | Décision |
|-------|----------|
| Photo de profil home | Portrait carré arrondi `rounded-sheet` (1.5 rem) + frame `bg-primary p-1` |
| Listes portfolio / compétences | Grille asymétrique 2/3 + 1/3 ; carousel réservé aux galeries intra-fiche |
| Orbitron | Retiré partout, remplacé par `Manrope` (titres) + `Newsreader` (corps) |
| Opacité cartes sur wallpaper | 85 % + `backdrop-blur-vellum` (≈ 20 px) pour la "sheet of vellum" |
| Icônes | `Material Symbols Outlined` (déjà utilisées dans la newsletter Stitch et Listmonk) |
| Mode sombre | Light-only pour cette refonte |
| Cercles animés `circle-one` / `circle-two` | Repalette vers `primary` / `primary-container` (au lieu de rose/indigo) |
| Compteur de visites | Migré dans le footer, en `text-[10px] uppercase tracking-[0.3em] text-outline` |

## 3. Design tokens portés dans `tailwind.config.ts`

Voir le fichier pour la liste exhaustive. Rappel des plus utilisés :

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#26445d` | CTAs, headlines, frames image |
| `primary-container` | `#3e5c76` | dégradé CTA, drawer mobile |
| `primary-fixed` | `#cce5ff` | pastilles, badges, barres de citation |
| `secondary` | `#516169` | sous-titres, méta |
| `surface` | `#f8fafa` | base de page alternative au wallpaper |
| `surface-container-low` | `#f2f4f4` | sections secondaires |
| `surface-container-lowest` | `#ffffff` | cartes principales (posées à 85 % sur wallpaper) |
| `on-surface` | `#191c1d` | texte principal (jamais `#000`) |
| `outline-variant` | `#c3c7cd` | ghost-border à 15 % d'opacité max |

Radius additifs : `rounded-sheet` (1.5 rem) pour cartes principales, `rounded-tile` (1 rem) pour éléments imbriqués. Les radius Tailwind (`rounded-xl`, etc.) ne sont pas écrasés pour ne pas casser les composants existants.

Ombres : `shadow-ambient` (40 px / 6 %) pour les cartes flottantes, `shadow-jewel` (4 px offset) pour CTAs primaires.

Polices : `font-headline` (Manrope) et `font-body` (Newsreader), importées via `app/globals.css`.

## 4. Plan d'exécution (8 étapes)

Chaque étape = un lot cohérent + éventuelle mise à jour de `captures/AUDIT-VISUEL.md` et nouvelles captures.

| # | Étape | Fichiers principaux | Statut |
|---|-------|---------------------|--------|
| 1 | Fondations : tokens Tailwind + import polices + icônes | `tailwind.config.ts`, `app/globals.css` | **fait** (2026-04-22) |
| 2 | Garde-fou doc + mise à jour feuille de route | `docs-site-interne/REFONTE-VISUELLE.md`, `docs-site-interne/feuille-de-route.md` | **fait** (2026-04-22) |
| 3 | Migration typographique globale (Orbitron → Manrope / Newsreader) | `app/**/*.{tsx,jsx,js}`, `app/assets/main.css` | **fait** (2026-04-22) |
| 4 | Layout racine : header No-Line, burger ghost, palette cercles, compteur migré, drawer | `app/layout.tsx`, `app/components/NavLink.jsx`, `app/components/Footer.jsx` | **fait** (2026-04-22) |
| 5 | Home : hero vellum, portrait frame, takeaways, pull-quote, CTAs | `app/page.tsx` | **fait** (2026-04-22) |
| 6 | Listes portfolio + compétences : grille asymétrique, cartes éditoriales | `app/portfolio/page.jsx`, `app/competences/page.jsx`, composants `Carousel*` | **fait** (2026-04-22) |
| 7 | Fiches détail + modale glossaire + GrasBot (jewel flottant) | `app/portfolio/[slug]/page.tsx`, `app/competences/[slug]/page.tsx`, `app/components/ModalGlossaire.tsx`, `app/components/ChatBot.js` | **fait** (2026-04-22) |
| 8 | Contact + Footer éditorial | `app/contact/page.js`, `app/components/ContactForm.tsx`, `app/components/Footer.jsx` | **fait** (2026-04-22) |

## 4 bis. Correctif post-étape 3 (2026-04-22) — cohérence desktop/mobile

Après l'étape 3, retour utilisateur : **couleurs de texte différentes** entre desktop et mobile.

**Cause** : le template Next de base définissait dans `globals.css` un bloc `@media (prefers-color-scheme: dark)` qui basculait `--foreground` à `#ededed` (texte clair) selon le **thème système** de chaque appareil. Avant l'étape 3, les classes `.font-orbitron-*` forçaient `color: #333333` partout et masquaient ce mode sombre. En les retirant, la variable `--foreground` a pris effet et le rendu est devenu dépendant du thème OS (Windows clair → texte foncé ; mobile sombre → texte clair quasi invisible sur wallpaper clair).

**Fix** :

- Retrait du bloc `@media (prefers-color-scheme: dark)` dans `app/globals.css` (incohérent avec l'arbitrage "light-only").
- `--foreground` figé à `#191c1d` (= `on-surface` Stitch, jamais `#000`).
- `body.color` fixé à `#191c1d` en dur pour ne plus dépendre d'aucune variable conditionnelle.
- Classes Tailwind invalides `text-black-500` / `text-black-700` (qui n'existent pas et ne rendaient donc aucune couleur) remplacées par `text-gray-700` dans `app/layout.tsx`, `app/page.tsx`, `app/components/ContentSectionCompetences.tsx`.

**Leçon retenue (à appliquer aux étapes suivantes)** : quand on supprime un "masque" CSS (comme la couleur forcée d'Orbitron), toujours vérifier que la valeur qui va ré-émerger par héritage est bien la valeur attendue, pas une variable dépendante du contexte d'exécution.

## 4 ter. Correctif urgent modale glossaire (2026-04-22) — blocage mobile

Après l'étape 4, retour utilisateur sur Samsung S25 Ultra : les mots-clés du glossaire (compétences) ouvrent bien la modale mais **la modale déborde de l'écran**, **la croix de fermeture est hors champ**, impossible de refermer sans recharger la page.

**Causes identifiées** dans `app/components/ModalGlossaire.tsx` (pré-existantes avant la refonte) :

- Carte interne en `w-[114vw] max-w-6xl` : force une largeur > viewport sur mobile (114 % de 400 px = 456 px dans une fenêtre de 400 px), et sur desktop la contrainte est masquée par `max-w-6xl`.
- Hauteur figée `h-[72vh]` sans scroll interne : le contenu est simplement tronqué quand il dépasse.
- Aucune fermeture au tap sur le voile, ni à Esc. Seule issue = bouton `✖` en haut à droite, hors champ sur mobile.
- Bouton de fermeture en `text-sm p-1` : zone tactile < 44 px, sous le seuil Material Design pour le tactile.

**Fix** (anticipe les besoins de l'étape 7) :

- Carte interne : `w-full max-w-4xl max-h-[90vh]` + padding 4 sur le voile pour la marge latérale sur mobile.
- Contenu intérieur en `overflow-y-auto` pour scroll interne si nécessaire.
- Voile cliquable pour fermer, `stopPropagation` sur la carte pour ne pas fermer en interagissant avec.
- Fermeture `Escape` via `keydown` global.
- Bouton de fermeture rond `h-10 w-10` avec Material Symbol `close`, focus-visible, position `absolute top-3 right-3`.
- Alignement palette Stitch : voile `bg-on-surface/75 backdrop-blur-sm`, carte `bg-surface-container-lowest/95 backdrop-blur-vellum shadow-ambient rounded-sheet`, titre `text-primary`, description en `font-body` serif (Newsreader) pour lisibilité, texte `text-on-surface-variant`.
- Ajout de `"use client"` (manquant).
- `role="dialog" aria-modal="true" aria-label={...}` sur le conteneur, `aria-label` explicite sur le bouton de fermeture.

Ce correctif concerne uniquement le composant `ModalGlossaire`. L'étape 7 reprendra la refonte globale de cette zone (cohérence visuelle avec les fiches détail) mais le blocage UX mobile est levé dès maintenant.

## 4 quater. Correctifs post-étape 5 (2026-04-22) — home

Retour utilisateur sur la home fraichement refaite. Trois points, trois causes distinctes :

### Icônes Material Symbols affichées comme texte littéral

Les `<span class="material-symbols-outlined">psychology</span>` affichaient **le mot "psychology"** dans la font par défaut au lieu du glyphe, rendant les takeaways illisibles (texte blanc sur fond bleu = juste du texte). La règle `.material-symbols-outlined` de `app/globals.css` déclarait bien `font-variation-settings`, `display`, `line-height`… mais pas `font-family: 'Material Symbols Outlined'`. L'import Google Fonts pose le `@font-face`, il ne pose pas automatiquement la `font-family` sur la classe — c'est au site de le faire.

**Fix** : ajout de la ligne `font-family: 'Material Symbols Outlined';` dans la règle. Impact : toutes les icônes du site (takeaways, burger, modale glossaire, CTAs hero, icônes CTAs des futures étapes) s'affichent désormais comme icônes.

### Pull-quote "Démarche" peu lisible sur wallpaper

La règle DESIGN.md §5 "Editorial Pull-Quote" dit *"no background card, let the typography breathe on the surface"*. Valide quand la surface de base est un `bg-surface #f8fafa` uni (Stitch newsletter). Chez nous la surface de base est un wallpaper photographique, donc *respirer dessus = se fondre dedans*.

**Fix** : adaptation contextuelle — carte vellum **légère** (`bg-surface-container-lowest/65 backdrop-blur-vellum rounded-tile`, padding réduit, pas de `shadow-ambient`) pour rester lisible sans uniformiser les 3 sections en cartes identiques. La barre gauche `border-l-4 border-primary` et la typo Newsreader italique sont conservées.

**Leçon** : les règles DESIGN.md sont un langage, pas un dogme. Elles supposent une surface de base uniforme. Chaque fois qu'on est sur wallpaper, vérifier si la règle reste applicable telle quelle ou si elle demande une adaptation (ici : carte légère plutôt que zéro carte).

### Espace excessif entre les 3 sections de la home

`gap-8` (32 px) entre les sections + `py-6 md:py-8` sur la pull-quote donnaient ~80 px d'air vertical entre "Trois axes" et "Démarche".

**Fix** : `gap-8` → `gap-5` sur le container racine (20 px), `py-6 md:py-8` retiré sur la pull-quote (désormais remplacé par le padding interne de sa nouvelle carte). Les paddings internes des cartes (hero `p-6 sm:p-8 md:p-10`, takeaways `p-6 sm:p-8`) sont conservés — l'espace de contenu n'était pas le problème.

## 4 sexies. Séparateurs `<hr>` invisibles dans le hero (2026-04-22)

Le CV rendu par `ReactMarkdown` contient des `---` Markdown convertis en `<hr>`. Par défaut Tailwind Typography les stylise en bordure 1 px `border-gray-300` + `my-8` (32 px). Sur notre carte vellum semi-transparente, cette bordure grise est quasi invisible sur le wallpaper, mais les 64 px de marge verticale (my-8 en haut **et** en bas) restent et donnent l'illusion d'un espace excessif entre les paragraphes du hero.

**Fix (Option B — barre décorative)** : on surcharge `prose-hr` pour transformer la règle en **petite pastille Stitch** centrée. Classes ajoutées sur le wrapper `ReactMarkdown` :

```
prose-hr:border-0 prose-hr:w-16 prose-hr:mx-auto
prose-hr:bg-primary/30 prose-hr:h-0.5 prose-hr:rounded-full
prose-hr:my-6
```

Résultat : une barre 64 × 2 px, couleur primaire à 30 % d'opacité, arrondie, avec 24 px de marge au lieu de 32 px. Le séparateur redevient un **signal visuel intentionnel** cohérent avec la palette Stitch, et l'espace perçu entre les paragraphes tombe à un niveau confortable sans perdre la structure éditoriale du CV.

**Alternatives considérées** : Option A (`prose-hr:hidden`, perd la structure), Option C (`prose-hr:my-4` seul, garde la bordure grise invisible — n'adresse pas la cause).

## 4 quinquies. Compatibilité Chrome Auto-Translate (2026-04-22)

Les icônes Material Symbols Outlined fonctionnent via **ligatures de font** : un `<span class="material-symbols-outlined">psychology</span>` n'affiche « psychology » qu'en fallback — si la font est chargée, la ligature transforme ce texte en glyphe « cerveau ». Google Chrome propose à l'utilisateur mobile de traduire automatiquement une page dès que sa langue par défaut n'est pas celle du document. Lorsque la traduction s'active, **Chrome réécrit le `textContent`** (« psychology » → « psychologie ») : la ligature ne correspond plus à aucun glyphe dans la font, l'icône redevient du texte brut, et les layouts se décalent.

**Règle permanente pour la refonte** : chaque `<span class="material-symbols-outlined">` doit porter **`translate="no"`** (attribut HTML). Pareil pour les éléments contenant un nom propre qui ne doit pas être déformé (titre du site, nom d'école « 42 », nom de ville, etc.). Le reste du contenu éditorial (CV, descriptions de projets, fiches compétences) reste traductible — la traduction automatique est un vrai plus pour un portfolio qu'on veut accessible à l'international.

Composant wrapper `<Icon>` qui pose automatiquement `translate="no"` envisagé comme DRY à long terme (hors scope actuel).

## 6. Étape 6 — Listes portfolio + compétences (2026-04-22)

Les deux pages liste étaient héritées du design avant refonte : cartes `bg-white/80 rounded-lg` à taille **fixe** (`w-80 h-96` sur portfolio, `max-w-xs…2xl` en cascade sur compétences), `hover:scale-105` qui débordait sous le header, **chaque vignette embarquait un `Swiper` autoplay** (cf. `Carousel.tsx` et `CarouselCompetences.tsx`) — bruit visuel constant, coût réseau (3-5 images × N cartes chargées d'emblée), et incohérence avec l'arbitrage acté § 2 *"carousel réservé aux galeries intra-fiche"*. Sur mobile, la largeur fixe 320 px de la carte portfolio débordait un viewport 360 px + padding.

### Direction Stitch appliquée

**Règle DESIGN.md §6 "No-Grid-Lock"** interdit la grille 3 colonnes symétrique. On adopte une grille **asymétrique 2/3 + 1/3** qui donne un rythme éditorial plutôt qu'un catalogue :

```
md:grid-cols-6, pattern de spans par index modulo 4 :
  idx 0 → md:col-span-4 (vedette, 2/3)
  idx 1 → md:col-span-2 (1/3)
  idx 2 → md:col-span-2 (1/3)
  idx 3 → md:col-span-4 (vedette, 2/3)
```

Sur `sm` on bascule en `grid-cols-2` classique (pas de `col-span` tablette pour garder 2 cartes par ligne), sur mobile `grid-cols-1` pleine largeur. Le même pattern est répliqué pour les skeletons de chargement → l'empreinte visuelle est stable pendant le fetch.

### Anatomie de carte "feuillet de vellum"

Toutes les cartes sont des `Link` pleine-carte (plus de `Link` imbriqué ambigu) avec :

- Wrapper : `rounded-sheet bg-surface-container-lowest/85 backdrop-blur-vellum shadow-ambient`, `group` pour propager le hover.
- Hover : `hover:-translate-y-0.5 hover:shadow-jewel` (lift subtil + empreinte tactile Stitch) remplace l'ancien `scale-105` qui débordait et cassait l'alignement de la grille.
- Média : `aspect-[4/3]` fixe (plus de hauteurs variables) + `overflow-hidden` + `object-cover` + `group-hover:scale-[1.03]` sur l'image (sensation vitrine, discret).
- Placeholder `material-symbols-outlined image` centré si pas d'image — `translate="no"` en place (§ 4 quinquies).
- Corps : kicker uppercase tracking-[0.3em] (« Projet » / « Compétence ») + titre Manrope extrabold `text-primary` + description Newsreader `text-on-surface-variant` clampée à 3 lignes (`line-clamp-3`, core Tailwind 3.4) pour homogénéiser les hauteurs.
- CTA tertiaire « Découvrir → » / « Explorer → » Manrope uppercase `text-primary`, avec flèche Material Symbols `arrow_forward` qui se décale à droite au hover (`group-hover:translate-x-1`). Icône `translate="no"`.

### États

- **Chargement** : 4 skeletons animés (`animate-pulse bg-surface-container-low/80`) suivant le même pattern de spans que la grille réelle → pas de saut de layout.
- **Vide** : carte centrée avec Material Symbol (`inbox` pour portfolio, `school` pour compétences) + message Newsreader italique. Remplace l'ancien `text-gray-500` orphelin.

### Ce que ça règle

- **Régression mobile** : `w-80 h-96` retiré, la carte prend la largeur de la colonne → plus de débordement S25 Ultra.
- **Bruit visuel** : `Swiper` autoplay retiré des listes, le scroll n'est plus concurrencé par 3-5 carousels qui tournent simultanément.
- **Poids réseau** : une image `loading="lazy"` par carte au lieu de toutes les images de toutes les galeries au chargement initial.
- **Hiérarchie** : les pages liste ont désormais un **en-tête éditorial** (kicker + titre + pitch) cohérent avec le hero de la home.
- **Cohérence Stitch** : palette `primary` / `on-surface-variant`, radius `rounded-sheet`, ombres `shadow-ambient` / `shadow-jewel`, typographie Manrope + Newsreader → alignement 1:1 avec la home.

### Correctif post-étape 6 — wallpaper sur-zoomé sur pages longues

Retour utilisateur une fois `/portfolio` en ligne : le wallpaper apparaît **beaucoup plus zoomé** sur les listes que sur la home, ce qui casse la cohérence visuelle entre les rubriques.

**Cause** : dans `app/layout.tsx`, la div `.bg-wallpaper` était posée en `absolute inset-0` **à l'intérieur** du conteneur grid `min-h-[100dvh]`. Sur la home, le contenu tient en ≈ 1 viewport → le conteneur fait ≈ 1 viewport de haut → `background-size: cover` cadre l'image à sa taille naturelle. Sur les listes portfolio / compétences (en-tête + grille 4+ cartes + footer), le conteneur atteint 2 à 3 viewports de haut → `cover` redimensionne l'image pour couvrir **toute cette hauteur**, ce qui la fait apparaître zoomée et décalée. Effet amplifié au scroll car le wallpaper défile avec la page.

**Fix** : sortir le wallpaper du conteneur grid et le passer en `fixed inset-0 z-0 pointer-events-none`. Il est désormais calé sur le **viewport**, garde ses dimensions naturelles indépendamment de la longueur de la page, et reste stable au scroll. Les cercles animés `circle-one` / `circle-two` restent en `absolute` dans le grid pour conserver le comportement de parallax léger au scroll.

```tsx
<div className="fixed inset-0 z-0 bg-wallpaper pointer-events-none" aria-hidden="true"></div>
```

**Impact transversal** : corrige au passage le même problème latent sur toutes les autres pages longues (futures fiches détail, page contact si elle s'allonge, etc.) — plus besoin d'y repenser page par page.

### Points laissés pour l'étape 7

- Les composants `Carousel.tsx` et `CarouselCompetences.tsx` **ne sont pas touchés** (ils restent utilisés par les pages détail `[slug]/page.tsx`). La refonte visuelle de ces carousels (pagination, flèches, lightbox) se fera dans le lot 7 avec les fiches détail et la modale glossaire.
- Pas de filtre / tri côté liste pour l'instant (les items sont peu nombreux, `order` de Strapi suffit). À ré-évaluer si le catalogue grossit.

### Correctif post-étape 6 — réintroduction du défilement automatique en vignette

Premier retour utilisateur après l'étape 6 : *« j'ai perdu ma fonctionnalité précédente du carousel où les images des vignettes chargées depuis Strapi défilaient »*. L'arbitrage initial *"carousel réservé aux galeries intra-fiche"* (§ 2 — tableau d'arbitrages) était motivé par le bruit visuel et le poids réseau de **plusieurs `Swiper` autoplay** qui tournaient simultanément. Mais le défilement auto des images en vignette faisait partie intégrante de l'expérience de découverte du portfolio pour l'auteur. **L'arbitrage est donc révisé** : on conserve le défilement en vignette, mais via un composant **allégé et cadré** plutôt que le `Carousel.tsx` complet.

**Nouveau composant `app/components/VignetteCarousel.tsx`** — différences délibérées avec `Carousel.tsx` / `CarouselCompetences.tsx` :

- **Pas de flèches de navigation** (`Navigation` module non chargé). Les flèches créaient une **zone de clic ambiguë** avec le `<Link>` englobant la vignette : cliquer sur une flèche déclenchait la navigation vers la fiche détail au lieu de faire défiler le carousel. L'autoplay + le swipe tactile suffisent à l'échelle d'une vignette.
- **Pas de lightbox** (pas de `createPortal` ni de `selectedImage`). L'ouverture plein écran reste une signature de la **fiche détail**, pas de la liste.
- **Pagination bullets Stitch** : `--swiper-pagination-color: #26445d` (primary) et bullets inactifs blancs à 55 % d'opacité, taille 6 px. Surcharge inline via `style={...}` pour éviter de polluer `globals.css` avec un sélecteur `.swiper-pagination-bullet` global qui risquerait de toucher aussi les carousels de la fiche détail.
- **Autoplay 3500 ms** (vs 3000 ms historique) pour laisser plus de temps à la lecture sur les cartes vedette 2/3.
- **`loop` conditionnel** (`images.length > 1`) : sans ça Swiper loggait un warning quand une entrée Strapi n'avait qu'une seule image.

**Intégration dans les listes** : dans `app/portfolio/page.jsx` et `app/competences/page.jsx`, la logique est `length > 1 ? <VignetteCarousel /> : <img statique />` — identique à la version pré-refonte pour les entrées mono-image, plus performante pour les entrées multi-images. Les `alt` sont générés à partir de `img.name` Strapi avec fallback sur le nom du projet / compétence.

**Pourquoi ne pas avoir réutilisé `Carousel.tsx` tel quel** : il embarque flèches + lightbox + CSS de navigation. Dans le contexte d'un `<Link>` englobant, les flèches auraient conflit, et la lightbox serait inaccessible (capturée par le lien). Ajouter des `stopPropagation` sur ces zones nuirait à l'UX "clic n'importe où sur la carte = ouverture de la fiche". Un composant dédié aux vignettes, avec moins de surface d'interaction, est plus clair à maintenir. Les deux composants `Carousel*.tsx` restent intacts pour la fiche détail (étape 7).

Les composants `app/components/Carousel.tsx` et `app/components/CarouselCompetences.tsx` deviennent donc formellement **"carousels de fiche détail"** dans la nomenclature interne ; `VignetteCarousel` est leur petit frère "liste". Un éventuel refactor plus tard pourra fusionner les deux premiers (quasi-doublons) — hors scope actuel.

## 7. Étape 7 — Fiches détail + glossaire + GrasBot flottant (2026-04-22)

L'étape 7 touche cinq composants et introduit un sixième (le FAB). Elle est découpée en cinq sous-lots décrits ci-dessous.

### 7.a Carousels fiche détail (`Carousel.tsx` + `CarouselCompetences.tsx`)

Les deux composants sont quasi-doublons historiques ; on les refait **à l'identique** pour ne pas risquer de régression sur la modale glossaire qui consomme `CarouselCompetences`. Un futur refactor pourra les fusionner une fois le périmètre de la refonte clos (pas dans le scope étape 7).

Changements appliqués :
- **Pagination bullets `primary`** via surcharge inline des variables Swiper (`--swiper-pagination-color: #26445d`, bullets 8 px). Même approche que `VignetteCarousel` pour ne pas polluer `globals.css` avec un sélecteur `.swiper-pagination-bullet` global.
- **Flèches** : on conserve les chevrons natifs Swiper, recolorés via `--swiper-navigation-color: #26445d`, taille 28 px. Remplacement par Material Symbols écarté (demande un override complet du markup via slots Swiper, sans bénéfice visuel proportionnel).
- **Conteneur** : `rounded-tile overflow-hidden shadow-ambient-sm` (vs `rounded-md shadow-md` pré-refonte).
- **`autoplay: 3500` + `disableOnInteraction: false`** : l'autoplay reprend après un swipe manuel plutôt que de rester figé.
- **`loop` conditionnel** (`images.length > 1`) : évite le warning Swiper sur les entrées mono-image.
- **Lightbox Stitch** : voile `bg-on-surface/80 backdrop-blur-sm` (vs `bg-black/10 backdrop-blur-2xl` qui noyait l'image dans un flou 2xl contre-productif), image en `object-contain max-h-[92vh] max-w-[92vw] rounded-sheet shadow-ambient` (ne déforme plus les portraits), bouton close rond 40 px Material Symbol `close` (`translate="no"`), verrouillage du scroll body + fermeture `Escape` + fermeture sur clic voile avec `stopPropagation` sur l'image.

### 7.b Fiche portfolio (`ContentSection.tsx`)

Avant : cartes `bg-white/50 text-blue-700 font-headline font-extrabold` hardcodées, lien externe `bg-white/65 text-red-700 hover:text-blue-700`, pas de retour vers la liste, pas de hiérarchie éditoriale. Contenu Markdown sans `prose`.

Après :
- **Gabarit aligné** sur les listes (étape 6) : wrapper `max-w-3xl` centré, fil d'Ariane minimaliste (pastille ronde `bg-surface-container-lowest/70 backdrop-blur-vellum` avec Material Symbol `arrow_back` + label « Portfolio »), carte vellum principale (`rounded-sheet bg-surface-container-lowest/85 shadow-ambient backdrop-blur-vellum`).
- **En-tête éditorial** : kicker `Projet · Portfolio` uppercase tracking-[0.3em] + titre Manrope extrabold `text-on-surface`.
- **Carousel détail** : `<Carousel>` plein cadre (`h-64 sm:h-80 md:h-96`) réutilise la version 7.a.
- **Corps Markdown en `prose` Stitch** : mêmes overrides que la home (`prose-headings:text-primary`, `prose-p:text-on-surface-variant`, `prose-hr:` transformés en pastille primary via le fix § 4 sexies). Le CV et les fiches partagent désormais la **même charte typographique**.
- **CTA externe jewel** : `bg-primary text-white shadow-jewel` avec Material Symbol `open_in_new` (`translate="no"`) et hover `-translate-y-0.5`. Le `linkText` Strapi reste utilisé, fallback « Voir plus » (au lieu de « Voir plus/lien externe » qui mélangeait 2 intentions).
- **États loading + not-found** en vellum plutôt qu'en ligne `text-gray-500` orpheline. Le not-found propose un retour explicite vers `/portfolio`.

### 7.c Fiche compétences (`ContentSectionCompetences.tsx` + `Container`)

Trois chantiers en un :

**Style** : gabarit identique à 7.b (pastille retour, en-tête vellum, carousel 16/9, prose Stitch). Les `titleClass` / `contentClass` historiques ne sont plus consommés mais on les garde dans l'interface TS pour ne pas casser le call-site.

**Keywords glossaire/chatbot sans styles inline** : avant, `transformMarkdownWithKeywords` injectait `<span style="color: blue">...</span>` — visuellement criard et non thématisable. Après, on injecte les classes `.glossary-keyword` et `.chatbot-keyword` (définies dans `globals.css`), stylées en `color: #26445d` (primary), `text-decoration: underline dotted`, `text-underline-offset: 3px`. Le soulignement pointillé signale l'interactivité sans rompre le flux de lecture, la couleur cohérente avec toute la charte Stitch. Attributs `role="button" tabindex="0"` ajoutés au passage pour l'accessibilité clavier (touche Entrée peut être câblée plus tard si besoin).

**Event listeners scopés** : avant, `document.body.addEventListener("click", ...)` × 2. Après, un seul listener attaché à `contentRef` (ref sur le wrapper prose). Les clics remontent en bubbling depuis les spans Markdown jusqu'au wrapper ; gain en clarté, pas de fuite, pas de risque de conflit avec d'autres zones du DOM. Le handler `keyword` → ouvre `ModalGlossaire`. Le handler `chatbot` → dispatch `CustomEvent("grasbot:open")` sur `window` pour réveiller le FAB global (7.e) au lieu d'instancier un `<ChatBot />` local.

**Container** (`ContentSectionCompetencesContainer.tsx`) : l'état de chargement `⏳ Chargement des compétences...` remplacé par un skeleton vellum (kicker + titre + carousel + 3 lignes de texte en `animate-pulse`), cohérent avec les listes et `ContentSection`.

### 7.d ChatBot (`ChatBot.js`)

Le composant garde son API (`onClose`) mais tout le shell visuel est refait :

| Zone | Avant | Après |
|------|-------|-------|
| Carte | `bg-white/70 shadow-lg rounded-lg border border-gray-300` | `bg-surface-container-lowest/95 backdrop-blur-vellum rounded-sheet shadow-ambient` (= gabarit vellum partagé) |
| Header | `bg-blue-600 text-white` + 💬 emoji + ❌ | `bg-primary text-white` + Material Symbol `smart_toy` + sous-titre Manrope uppercase « Assistant IA locale » + bouton close rond Material Symbol |
| Bulle user | `bg-blue-500 ml-auto` | `bg-primary text-white rounded-sheet` |
| Bulle bot | `bg-gray-500 mr-auto` | `bg-surface-container text-on-surface rounded-sheet` |
| Indicateur attente | `wait...` sur bulle grise | « GrasBot réfléchit... » en italique atténué avec 3 points animés `.dot-1/2/3` existants |
| Input | `border border-gray-300 rounded-l-lg` | `bg-surface-container-low rounded-tile focus-visible:ring-2 focus-visible:ring-primary` |
| Envoyer | `bg-blue-500 text-white ➤` | Bouton rond Material Symbol `send` jewel `bg-primary shadow-jewel hover:-translate-y-0.5`, disabled si vide ou en attente |

Ajouts fonctionnels : auto-scroll en bas à chaque nouveau message (ref `scrollRef`), focus auto sur l'input à l'ouverture, envoi à Entrée (`handleKeyDown`), input désactivé pendant l'attente (plus de double envoi possible), message d'accueil éditorial quand la conversation est vide.

### 7.e GrasBotFab (`GrasBotFab.tsx`)

Nouveau composant monté une seule fois dans `app/layout.tsx` → le chatbot est désormais accessible **depuis toutes les pages**, plus seulement les fiches compétences.

**Anatomie** :
- **Bouton** : `fixed bottom-6 right-6 z-30`, rond 56 px (64 px md), `bg-primary text-white shadow-jewel` avec Material Symbol `smart_toy` (→ `close` quand ouvert). Hover `-translate-y-0.5 hover:bg-primary-container`. `aria-expanded` tenu à jour.
- **Panneau** : `fixed inset-x-4 bottom-24` mobile (plein largeur - 16 px de chaque côté), `sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:h-[560px]` desktop. `role="dialog"` avec `aria-label`. Monte le `<ChatBot>` refait en 7.d avec `onClose` qui ferme le panneau.
- **Fermeture Esc** globale dès que le panneau est ouvert.

**Flux d'entrée** :
- Clic direct sur le FAB → ouvre le panneau.
- Clic sur `.chatbot-keyword` (« IA locale ») dans une fiche compétence → `ContentSectionCompetences` dispatch `window.dispatchEvent(new CustomEvent("grasbot:open"))`, le FAB écoute et ouvre. Pas de Context, pas de store : un `CustomEvent` suffit pour un besoin one-shot et garde les composants découplés.

**Z-index** : le FAB est en `z-30`. Header en `z-20`, drawer mobile en `z-40`. On passe donc le FAB **devant** le header (sinon invisible sous la bande fixe) mais **derrière** le drawer (pour ne pas masquer la navigation). Si le drawer est ouvert, le FAB est recouvert ; acceptable, le drawer étant un mode modal de navigation.

### Points laissés pour l'étape 8

- Fusion de `Carousel.tsx` et `CarouselCompetences.tsx` (doublons) : hors scope étape 7 (pas de gain visuel, risque de régression non justifié). À reprendre en lot "dette technique" après l'étape 8.
- `ModalGlossaire` déjà aligné Stitch au correctif § 4 ter ; aucun changement nécessaire en 7, juste une vérification que son `CarouselCompetences` hérite bien de la lightbox 7.a — oui, c'est automatique.
- Persistance du fil de conversation GrasBot (refresh = historique perdu) : pas demandé, pas introduit. Ajouter un `localStorage` si besoin plus tard.

## 8. Étape 8 — Contact + Footer éditorial (2026-04-22)

Dernière page héritée d'avant refonte. Avant : `app/contact/page.js` utilisait `bg-white/50 rounded-md`, `border-b-4 border-blue-500 pb-2` sous les titres, et `ContactForm` affichait un formulaire `bg-white shadow-lg rounded-lg` bleu Tailwind (`bg-blue-500`). Incohérent avec le reste du site depuis l'étape 5 (tokens Stitch `primary = #26445d`, radius `sheet` / `tile`, ombres `shadow-ambient` / `shadow-jewel`).

### 8.a Page contact (`app/contact/page.js`)

Gabarit aligné sur les listes (étape 6) et le hero home (étape 5) :

- **Colonne utile `max-w-3xl`** (format "lettre", plus intime que les `max-w-6xl` des listes).
- **Hero éditorial vellum** : kicker uppercase tracking-[0.3em] « Contact · Prendre la parole » + titre Manrope extrabold `text-on-surface` « Correspondance » + pitch Newsreader `text-on-surface-variant`. Plus d'emoji `📬` dans le titre (cohérence avec les autres pages qui utilisent Material Symbols, pas des emojis).
- **Section « canaux directs »** : carte vellum principale avec titre secondaire (`text-primary`) puis grille 3 tuiles imbriquées `rounded-tile bg-surface-container-low/80 hover:bg-surface-container/80`. Chaque tuile = pastille primaire ronde avec Material Symbol (`link` pour LinkedIn, `public` pour Facebook, `alternate_email` pour email) + label kicker + handle tronqué + chevron `arrow_forward` qui se décale au hover. Mêmes codes visuels que les cartes vignette portfolio / compétences, sans l'aspect 2/3+1/3 (3 canaux = symétrie assumée).
- **Carte vellum principale pour le formulaire** : `rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8`, titre secondaire « Écrire un message » `text-primary` + pitch italique Newsreader « Temps de réponse habituel : 48 h ». Le form est rendu **sans** sa propre carte blanche (la carte parente suffit).
- Les **liens externes** (LinkedIn, Facebook) ont `target="_blank" rel="noopener noreferrer"` ; l'email ouvre un `mailto:` standard.

### 8.b ContactForm (`app/components/ContactForm.tsx`)

Refonte interne complète :

- **Suppression** du wrapper `bg-white shadow-lg rounded-lg` : le formulaire vit dans la carte vellum parente (page 8.a). Empêche le "double carton" incohérent avec la charte.
- **Labels visibles** en Manrope uppercase tracking-[0.3em] (au-dessus de chaque champ) — améliore l'accessibilité et aligne sur les kickers de la page. Les placeholders restent là à titre indicatif.
- **Champs** : `bg-surface-container-low/90`, `rounded-tile`, padding `px-4 py-3`, focus `focus-visible:ring-2 focus-visible:ring-primary`, placeholder en `text-on-surface-variant/70`. Le `textarea` gagne `min-h-[9rem] resize-y` (contrôle vertical par l'utilisateur, pas de hauteur figée gênante).
- **Bouton CTA jewel** : `bg-primary text-on-primary shadow-jewel hover:-translate-y-0.5 rounded-tile px-6 py-3 font-headline uppercase tracking-widest` + Material Symbol `send` (`translate="no"`). État `disabled` en `bg-outline-variant/60 text-on-surface-variant cursor-not-allowed` avec icône `hourglass_top`.
- **Feedback status** : plus de chaîne emoji `❌`/`✅`/`⏳` — un petit bandeau `rounded-tile` avec Material Symbol + texte, couleur selon l'état :
  - `success` → `bg-primary-fixed/70 text-on-primary-fixed` + `check_circle`
  - `error` → `bg-error-container text-on-error-container` + `error`
  - `loading` → `bg-surface-container text-on-surface-variant` + `hourglass_top`
- **Accessibilité** : `role="status" aria-live="polite"` sur le bandeau, `autoComplete` (`name`, `email`), `noValidate` sur le form (on fait la validation en JS pour maîtriser les messages FR). L'ancien `isSuccess: boolean | null` à double état est remplacé par un `statusKind: "idle" | "loading" | "success" | "error"` unique, plus lisible.

### 8.c Footer (`app/components/Footer.jsx`)

Avant : `bg-white/50 rounded-lg backdrop-blur` + `text-gray-700`. Déjà partiellement migré (font-headline, `visite n°` en kicker) mais surface + radius hors charte.

Après : **carte vellum légère** centrée, sans ombre ambient (le footer ne doit pas flotter autant que le contenu principal) :

- Conteneur : `rounded-tile bg-surface-container-lowest/70 backdrop-blur-vellum px-6 py-5 text-center`.
- Trois lignes éditoriales :
  1. **Signature** Manrope `text-primary` « Fernand Gras-Calvet » (identité).
  2. **Pitch** Newsreader italic `text-on-surface-variant` « Portfolio — Étudiant 42 Perpignan · © {year} » (ton éditorial cohérent avec le hero home).
  3. **Compteur** de visites Manrope `text-[10px] uppercase tracking-[0.3em] text-outline` (méta discrète).
- **SSR-safe** : `new Date().getFullYear()` est calculé côté client (via `useState` init + `useEffect`) pour éviter un mismatch SSR / CSR si l'année bascule pile à minuit.

### Ce que ça règle

- **Dernière page hors charte migrée** : le site est désormais 100 % « Digital Atelier » (home, layout, listes, fiches, glossaire, chatbot, contact, footer).
- **Cohérence typo** : plus aucune référence à `font-headline font-extrabold border-b-4 border-blue-500 pb-2` (motif ancien).
- **Cohérence iconographique** : plus aucun emoji `📬 📩 🚀` résiduel dans les titres de page contact / form ; tout est passé en Material Symbols (seuls emojis acceptés = message utilisateur dans le chatbot, et l'emoji `📅` dans `sendMessage` qui reste un détail de payload côté Strapi, pas d'affichage direct).
- **Accessibilité contact** : labels visibles, `role="status"`, `aria-live="polite"`, `autoComplete` — améliore l'usage clavier / lecteur d'écran.
- **Footer** : plus de double lecture (`text-gray-700` sur `bg-white/50` contrastait mal sur wallpaper clair) — `text-on-surface-variant` sur vellum reste lisible partout.

### Points laissés en dehors de l'étape 8

- **Persistance du compteur de visites** côté serveur (Strapi) : hors scope refonte visuelle. Reste en `localStorage` comme avant.
- **Validation serveur des champs du form** (anti-spam, honeypot, reCAPTCHA) : hors scope refonte visuelle. Strapi ne filtre pour l'instant que sur la structure JSON attendue.
- **Fusion Carousel.tsx / CarouselCompetences.tsx** : reste en dette technique (déjà noté §7).

## 9. Post-refonte — Contact effectif via Brevo (2026-04-23)

La refonte visuelle a laissé le formulaire de contact en état "joli mais non fonctionnel" : il stockait les messages dans Strapi (content-type `message`), à consulter via `/admin/messages` (page publique, non protégée). Aucune notification.

**Décision** (discutée avec l'utilisateur) : supprimer le passage par Strapi, passer à une **notification email directe** via l'**API HTTP Brevo** (compte existant pour la newsletter). Plus simple, moins de surface d'attaque, notification immédiate.

### Changements

- **Nouveau** : `app/api/contact/route.ts` (Next.js App Router, runtime Node) — reçoit le form, valide, applique honeypot + rate-limit, appelle `POST https://api.brevo.com/v3/smtp/email`, retourne `{ ok: true | false, error }`.
- **Modifié** : `app/components/ContactForm.tsx` — appel vers `/api/contact` au lieu de `sendMessage(...)`. Ajout d'un **champ honeypot** `website` caché (position absolue hors écran + `aria-hidden` + `tabindex=-1`). Codes d'erreur serveur mappés en messages FR.
- **Supprimé** : `app/utils/sendMessage.ts` (plus utilisé), `app/admin/messages/page.tsx` (plus de consultation Strapi nécessaire, et cette page était exposée publiquement sans auth).
- **Supprimé côté Strapi** : `cmsbackend/src/api/message/` (content-type + routes + services + controllers). La table SQLite `messages` est laissée en place (orpheline, inoffensive).
- **Nouveau** : `.env.example` en racine pour documenter les variables requises, `docs-site-interne/contact-flow.md` pour l'architecture complète.

### Variables d'env (.env.local)

```env
BREVO_API_KEY=xkeysib-...
CONTACT_FROM_EMAIL=<expéditeur vérifié Brevo>
CONTACT_FROM_NAME=Portfolio — nouveau message
CONTACT_TO_EMAIL=grascalvet.fernand@gmail.com
CONTACT_TO_NAME=Fernand Gras-Calvet
```

### Anti-abus

- **Honeypot** : champ caché `website`. Si rempli → 200 silencieux + log warning (pas d'erreur pour ne pas signaler aux bots).
- **Rate-limit** : 3 envois / IP / 10 min (Map en mémoire). Limité en serverless multi-instance — acceptable pour un portfolio.
- **Validation serveur** : longueurs (120 / 160 / 5000), regex email, codes d'erreur en `UPPER_SNAKE_CASE` stables.

### Email reçu

- Sujet : `Nouveau message portfolio — {Nom}`
- Expéditeur : `CONTACT_FROM_NAME <CONTACT_FROM_EMAIL>`
- Reply-To : email du visiteur (un clic "Répondre" dans Gmail et le mail part au visiteur).
- Corps HTML : carte Stitch simplifiée (primary/secondary/surface-container-low) avec table nom/email/date/IP + zone message `pre-wrap`.

### Leçons retenues

1. **Surveiller les pages admin "dev"** qui fuitent en prod : `/admin/messages` listait les emails de tous les visiteurs en clair, sans auth. Avec la page supprimée, plus d'exposition.
2. **Clé API fuitant en clair dans un chat** : considérer comme compromise et régénérer. Documenté dans `contact-flow.md` § "Sécurité — rappels".
3. **Pour un besoin "1 seul destinataire" avec faible volume**, une route Next + API transactionnelle bat clairement une solution SMTP + plugin Strapi : moins de pièces, moins de config, même garantie de délivrabilité.

Voir `docs-site-interne/contact-flow.md` pour la procédure de test, les codes d'erreur, et le rollback éventuel.

## 5. Checklist relecture (à passer à la fin de chaque étape)

- [ ] Aucune colonne unique globale `max-w-xl` (c'est le format newsletter).
- [ ] Aucune bottom nav fixe (déjà couvert par header + drawer).
- [ ] Aucune bordure 1px pleine (`border border-*`) sur un composant de contenu — sauf ghost-border à 15 % max.
- [ ] Aucune utilisation de `#000` pur — toujours `on-surface` / `on-background`.
- [ ] Le wallpaper reste perceptible entre / autour des cartes.
- [ ] La hiérarchie Manrope / Newsreader est respectée (pas de Orbitron résiduel).
- [ ] Les CTAs principaux ont `shadow-jewel`.
- [ ] Radius Stitch (`rounded-sheet` / `rounded-tile`) utilisés sur les cartes de la refonte.
- [ ] Chaque nouvelle icône Material Symbols Outlined ajoutée porte `translate="no"` (voir §4 quinquies).
