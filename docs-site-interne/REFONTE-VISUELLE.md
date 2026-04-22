# Refonte visuelle — Direction "Digital Atelier"

**Créé :** 2026-04-22  
**Statut :** en cours (étapes 1-3/8 terminées)  
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
| 4 | Layout racine : header No-Line, burger ghost, palette cercles, compteur migré, drawer | `app/layout.tsx`, `app/globals.css` | à faire |
| 5 | Home : hero vellum, portrait frame, takeaways, pull-quote, CTAs | `app/page.tsx` | à faire |
| 6 | Listes portfolio + compétences : grille asymétrique, cartes éditoriales | `app/portfolio/page.jsx`, `app/competences/page.jsx`, composants `Carousel*` | à faire |
| 7 | Fiches détail + modale glossaire + GrasBot (jewel flottant) | `app/portfolio/[slug]/page.tsx`, `app/competences/[slug]/page.tsx`, `app/components/ModalGlossaire.tsx`, `app/components/ChatBot.js` | à faire |
| 8 | Contact + Footer éditorial | `app/contact/page.js`, `app/components/ContactForm.tsx`, `app/components/Footer.jsx` | à faire |

## 5. Checklist relecture (à passer à la fin de chaque étape)

- [ ] Aucune colonne unique globale `max-w-xl` (c'est le format newsletter).
- [ ] Aucune bottom nav fixe (déjà couvert par header + drawer).
- [ ] Aucune bordure 1px pleine (`border border-*`) sur un composant de contenu — sauf ghost-border à 15 % max.
- [ ] Aucune utilisation de `#000` pur — toujours `on-surface` / `on-background`.
- [ ] Le wallpaper reste perceptible entre / autour des cartes.
- [ ] La hiérarchie Manrope / Newsreader est respectée (pas de Orbitron résiduel).
- [ ] Les CTAs principaux ont `shadow-jewel`.
- [ ] Radius Stitch (`rounded-sheet` / `rounded-tile`) utilisés sur les cartes de la refonte.
