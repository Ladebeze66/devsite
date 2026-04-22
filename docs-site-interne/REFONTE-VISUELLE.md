# Refonte visuelle — Direction "Digital Atelier"

**Créé :** 2026-04-22  
**Statut :** en cours (étapes 1-5/8 terminées)  
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
| 6 | Listes portfolio + compétences : grille asymétrique, cartes éditoriales | `app/portfolio/page.jsx`, `app/competences/page.jsx`, composants `Carousel*` | à faire |
| 7 | Fiches détail + modale glossaire + GrasBot (jewel flottant) | `app/portfolio/[slug]/page.tsx`, `app/competences/[slug]/page.tsx`, `app/components/ModalGlossaire.tsx`, `app/components/ChatBot.js` | à faire |
| 8 | Contact + Footer éditorial | `app/contact/page.js`, `app/components/ContactForm.tsx`, `app/components/Footer.jsx` | à faire |

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
