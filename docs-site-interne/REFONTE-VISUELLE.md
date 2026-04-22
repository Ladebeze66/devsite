# Refonte visuelle — Direction "Digital Atelier"

**Créé :** 2026-04-22  
**Statut :** en cours (étapes 1-4/8 terminées)  
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
| 5 | Home : hero vellum, portrait frame, takeaways, pull-quote, CTAs | `app/page.tsx` | à faire |
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

## 5. Checklist relecture (à passer à la fin de chaque étape)

- [ ] Aucune colonne unique globale `max-w-xl` (c'est le format newsletter).
- [ ] Aucune bottom nav fixe (déjà couvert par header + drawer).
- [ ] Aucune bordure 1px pleine (`border border-*`) sur un composant de contenu — sauf ghost-border à 15 % max.
- [ ] Aucune utilisation de `#000` pur — toujours `on-surface` / `on-background`.
- [ ] Le wallpaper reste perceptible entre / autour des cartes.
- [ ] La hiérarchie Manrope / Newsreader est respectée (pas de Orbitron résiduel).
- [ ] Les CTAs principaux ont `shadow-jewel`.
- [ ] Radius Stitch (`rounded-sheet` / `rounded-tile`) utilisés sur les cartes de la refonte.
