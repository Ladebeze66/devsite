# Audit visuel et mise en forme

**Dernière mise à jour :** 2026-04-22  
**Captures :** [INDEX.md](./INDEX.md)

## Objectif

Recenser les **problèmes visuels** et de **mise en forme** pour les **corriger** avec traçabilité (code : `app/layout.tsx`, `app/page.tsx`, `app/components/Footer.jsx`, `app/globals.css`).

## Légende

| Champ | Sens |
|--------|------|
| **ID** | Numéro dans [INDEX.md](./INDEX.md) |
| **Constats** | Points validés ensemble |
| **Piste / correctif** | Idée ou implémentation |
| **Statut** | `OK` / `à traiter` / `fait` |

---

## ID 01 — Header et navigation desktop

| Fichier | `01-layout-header-nav-desktop.webp` |
| **Navigateur** | Google Chrome |
| **Constats** | Header OK, mais depuis la normalisation des conteneurs (option 1 zoom) le texte de plusieurs pages se retrouvait **collé** au header : le `<header>` étant `position: fixed`, il est **hors du flux** et ne prend pas de place dans la grille racine. Seule la home compensait, via un `mt-12` local. |
| **Piste / correctif appliqué (2026-04-22)** | Compensation **centralisée** dans `app/layout.tsx` : `<main>` en `pt-20 md:pt-24` (couvre la hauteur du header `h-16` + un peu d’air). Suppression du `mt-12` dupliqué sur la home (`app/page.tsx`) pour ne pas cumuler. Toutes les pages héritent désormais du même espace sous le header, plus besoin de compenser page par page. |
| **Statut** | `fait` |

---

## ID 02 — Menu mobile + header (et retour UX burger)

| Fichier | `02-layout-nav-mobile-ouverte.webp` |
| **Route** | `/` |
| **Code** | `app/layout.tsx` (header, overlay menu) |

### Constats (validés)

- Bouton **menu burger** trop imposant et « gris » (gros bloc) — à rendre plus discret.
- Côté **dézoom** (pinch) sur mobile : le **texte Strapi** + **header** se décalent à gauche, effet d’**incohérence** visuelle.

### Piste / correctif appliqué (2026-04-28) — option 1 (CSS / layout seulement)

- **Burger** : à affiner (taille, contraste) si besoin — voir capture actuelle.
- **Décalage au zoom (sans bloquer le zoom)** : pas de `maximum-scale` ni de meta viewport qui impose le zoom. Renfort uniquement côté **CSS** :
  - `html` / `body` : `overflow-x: hidden`, `min-width: 0`, `max-width: 100%` dans `app/globals.css` ;
  - grille racine, `<header>`, `<main>`, footer : `min-w-0`, `w-full` / `max-w-full` là où c’est utile (`app/layout.tsx`, `app/components/Footer.jsx`) ;
  - **`.bg-wallpaper`** : `width: 100%` (plus de `200vw` sur mobile) pour éviter le double de largeur de page et le débordement au pinch-zoom ;
  - page d’**accueil** : conteneur principal + bloc texte en `min-w-0` / `max-w-full` (`app/page.tsx`).

**Accessibilité** : le **verrouillage total du zoom** n’a **pas** été retenu (hors demande) ; on privilégie la mise en page. Si le dézoom reste gênant, on pourra itérer (contraintes sur le markdown, etc.).

### Refonte du menu mobile en drawer latéral (2026-04-22)

- **Ancien** : panneau mi-hauteur côté gauche + grosse croix `✖` → peu esthétique.
- **Nouveau** (`app/layout.tsx`) : **tiroir gauche** `role="dialog" aria-modal="true"`, **largeur 70 %** (capée à `max-w-sm`), hauteur pleine, fond **sombre translucide** (`bg-gray-900/70 backdrop-blur-md`), bordure droite fine.
- **Animation** : `transition-transform` + `-translate-x-full` ↔ `translate-x-0`, 300 ms, easing `ease-out` ; voile en fondu (`transition-opacity`). Respect de `prefers-reduced-motion` (voir `.mobile-drawer-*` dans `app/globals.css`).
- **Fermeture** : **pas de croix** ; tap sur le **voile**, **Échap**, **clic sur un lien**, **re-tap sur le burger** (qui affiche `✕` le temps de l’ouverture), et **auto-fermeture après 4 s** d’inactivité (timer remis à zéro à chaque interaction / touch dans le tiroir, nettoyé à la fermeture, et relancé à l’ouverture).
- **Accessibilité** : `aria-label` / `aria-expanded` / `aria-controls` sur le burger ; le focus revient sur le burger après fermeture ; fermeture automatique si l’écran passe en ≥ md (resize).

| **Statut** | `fait` — drawer latéral, auto-close 4 s, fond sombre translucide, 70 % |

---

## ID 03 — Accueil hero desktop

| Fichier | `03-accueil-hero-desktop.webp` |
| **Route** | `/` |
| **Code** | `app/page.tsx`, `app/layout.tsx` |
| **Constats** | Rien à corriger spécifiquement : les ajustements déjà faits côté **layout** (compensation du header `pt-20 md:pt-24`, conteneur `min-w-0 max-w-full`) et côté **home** (suppression du `mt-12` dupliqué, `min-w-0 max-w-full` sur le `<main>` et la zone markdown) couvrent la mise en forme. Hero, photo, titre et CV s’affichent correctement au-dessus du pli. |
| **Statut** | `OK` (pris en charge par les correctifs ID 01 / option 1) |

---

## ID 04 — Accueil hero mobile

| Fichier | `04-accueil-hero-mobile.webp` |
| **Route** | `/` |
| **Code** | `app/page.tsx`, `app/layout.tsx` |
| **Constats** | Couvert par les correctifs globaux : **drawer** latéral (ID 02), **compensation header** (`pt-20 md:pt-24`), conteneurs en `min-w-0 / max-w-full`, `.bg-wallpaper` ramené à `width: 100%` sur mobile. Hero lisible, sans débordement au zoom, texte non collé au header. |
| **Statut** | `OK` (pris en charge par les correctifs ID 01 / ID 02 / option 1) |

---

## ID 05 à 21 — Passage global en `OK`

Les captures suivantes **n’ont pas révélé de problème spécifique** après les correctifs **option 1** (CSS / layout — overflow, `min-w-0`, `.bg-wallpaper`), **ID 01** (compensation du header `pt-20 md:pt-24`) et **ID 02** (refonte du menu mobile en drawer latéral). Elles sont donc marquées **`OK`** à ce stade. Elles restent sujettes à la **refonte visuelle plus large** à venir, qui pourra les reprendre une par une.

| ID | Section | Route | Fichier | Statut |
|----|---------|-------|---------|--------|
| 05 | Accueil page longue | `/` | `05-accueil-page-pleine-desktop.webp` | `OK` |
| 06 | Accueil chargement | `/` | *(non fourni — optionnel)* | `ignoré` |
| 07 | Portfolio liste desktop | `/portfolio` | `07-portfolio-liste-desktop.webp` | `OK` |
| 08 | Portfolio liste mobile | `/portfolio` | `08-portfolio-liste-mobile.webp` | `OK` |
| 09 | Portfolio fiche desktop | `/portfolio/slug` | `09-portfolio-detail-desktop-presentation-ecole-42.webp` | `OK` |
| 10 | Portfolio fiche mobile | `/portfolio/slug` | `10-portfolio-detail-mobile-presentation-ecole-42.webp` | `OK` |
| 11 | Compétences liste desktop | `/competences` | `11-competences-liste-desktop.webp` | `OK` |
| 12 | Compétences liste mobile | `/competences` | `12-competences-liste-mobile.webp` | `OK` |
| 13 | Compétences fiche desktop | `/competences/slug` | `13-competences-detail-ia-desktop.webp` | `OK` |
| 14 | Compétences fiche mobile | `/competences/slug` | `14-competences-detail-ia-mobile.webp` | `OK` |
| 15 | GrasBot ouvert desktop | `/competences/slug` | `15-competences-grasbot-ouvert-desktop.webp` | `OK` |
| 16 | Glossaire modal desktop | `/competences/slug` | `16-competences-glossaire-ouvert-desktop.webp` | `OK` |
| 17 | Contact formulaire desktop | `/contact` | `17-contact-formulaire-desktop.webp` | `fait` (étape 8, 2026-04-22) |
| 18 | Contact formulaire mobile | `/contact` | `18-contact-formulaire-mobile.webp` | `fait` (étape 8, 2026-04-22) |
| 19 | Footer desktop | `/` | `19-layout-footer-desktop.webp` | `fait` (étape 8, 2026-04-22) |
| 20 | Compteur visites desktop | `/` | `20-layout-compteur-visites-desktop.webp` | `OK` |
| 21 | ~~Admin messages desktop~~ | ~~`/admin/messages`~~ | `21-admin-messages-desktop.webp` | `obsolète` (route supprimée le 2026-04-23, voir `contact-flow.md`) |

---

## Suite

- **Étape 8 Digital Atelier bouclée** (2026-04-22) : contact + formulaire + footer migrés à la charte Stitch (voir `docs-site-interne/REFONTE-VISUELLE.md §8`).
- **Formulaire de contact rendu effectif** (2026-04-23) : envoi via **Brevo** au lieu de Strapi. Content-type `message` supprimé, page `/admin/messages` supprimée, honeypot + rate-limit ajoutés. Voir `docs-site-interne/contact-flow.md` et `REFONTE-VISUELLE.md §9`.
- Prendre de **nouvelles captures** 17 / 18 / 19 pour figer le rendu post-refonte (remplacement des WebP existants dans `docs-site-interne/captures/`). La capture 21 est désormais **obsolète** (route supprimée).
- Dette technique identifiée : fusion `Carousel.tsx` / `CarouselCompetences.tsx` (doublons), persistance serveur du compteur de visites. Anti-spam formulaire : **fait** (honeypot + rate-limit, 2026-04-23).
