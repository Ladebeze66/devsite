# Audit visuel et mise en forme

**Dernière mise à jour :** 2026-04-28  
**Captures :** [INDEX.md](./INDEX.md)

## Objectif

Recenser les **problèmes visuels** et de **mise en forme** pour les **corriger** avec traçabilité (voir aussi les changements dans le code : `app/layout.tsx`, `app/ClientRootLayout.tsx`, `app/page.tsx`, `app/globals.css`).

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
| **Constats** | Aucun problème majeur. |
| **Statut** | `OK` |

---

## ID 02 — Menu mobile + header (et retour UX burger)

| Fichier | `02-layout-nav-mobile-ouverte.webp` |
| **Route** | `/` |
| **Code** | `app/ClientRootLayout.tsx` (header, overlay menu) |

### Constats (validés)

- Bouton **menu burger** trop imposant et « gris » (gros bloc) — à rendre plus discret.
- Côté **dézoom** (pinch) sur mobile : le **texte Strapi** + **header** se décalent à gauche, effet d’**incohérence** visuelle.

### Piste / correctif appliqué (2026-04-28)

- **Burger** : taille **32×32** (`h-8 w-8`), fond **blanc/ léger**, **bordure** fine au lieu du gros `p-2 bg-gray-300` ; icône sur une ligne ; **même bouton** affiche **✕** quand le menu est ouvert (évite l’icône toujours identique) ; `aria-label` / `aria-expanded`.
- **Décalage au zoom** : `body` + `html` en **`overflow-x: hidden`**, conteneurs en **`min-w-0` / `max-w-full`**, `viewport` explicite (`width=device-width`, `initialScale=1`) via **`app/layout.tsx`** (serveur). Un seul **`<main>`** côté layout ; la home utilise un **`div role="main"`** pour le contenu (évite double `<main>`).
- **Remarque accessibilité** : le **verrouillage total du zoom** (`user-scalable=no` / `maximum-scale=1`) n’a **pas** été activé : cela pénalise la lecture (WCAG). On a privilégié **mise en page** + **overflow**. Si le problème de dézoom reste, on pourra itérer (contraintes de largeur du markdown, etc.).

| **Statut** | `fait` (à valider sur appareil réel) |

---

## ID 03 — Accueil hero desktop

*À traiter à la prochaine passe.*  
| Fichier | `03-accueil-hero-desktop.webp` |

---

## Suite

| Prochain | Fichier |
|----------|--------|
| 04 | `04-accueil-hero-mobile.webp` puis 05… |