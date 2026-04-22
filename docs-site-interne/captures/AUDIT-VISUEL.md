# Audit visuel et mise en forme

**Dernière mise à jour :** 2026-04-28  
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
| **Constats** | Aucun problème majeur. Mise en page root renforcée (min-w-0, overflow-x) en parallèle de l’option 1 zoom. |
| **Statut** | `OK` |

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

| **Statut** | `fait` (à valider sur appareil réel) — opt-in zoom non appliqué pour l’instant |

---

## ID 03 — Accueil hero desktop

*À traiter à la prochaine passe.*  
| Fichier | `03-accueil-hero-desktop.webp` |

---

## Suite

| Prochain | Fichier |
|----------|---------|
| 04 | `04-accueil-hero-mobile.webp` puis 05… |
