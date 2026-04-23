# Index des captures — référence visuelle

**Dernière mise à jour :** 2026-04-01 — jeu de captures WebP déposé dans ce dossier (sauf ID 06, optionnel).

**Priorité** : **P0** = contexte global ; **P1** = refonte UI ; **P2** = optionnel.

## Fichiers réels dans le dépôt (état actuel)

Les noms suivants sont ceux présents sur disque. Les routes **dynamiques** utilisent deux conventions de slug (voir section Conventions slug).

| ID | Section | Route | Fichier dans le dépôt | P | Statut |
|----|---------|-------|------------------------|---|--------|
| 01 | Header + nav desktop | / | `01-layout-header-nav-desktop.webp` | P0 | OK |
| 02 | Menu mobile ouvert | / | `02-layout-nav-mobile-ouverte.webp` | P0 | OK |
| 03 | Accueil above the fold | / | `03-accueil-hero-desktop.webp` | P0 | OK |
| 04 | Accueil above the fold | / | `04-accueil-hero-mobile.webp` | P0 | OK |
| 05 | Accueil page longue | / | `05-accueil-page-pleine-desktop.webp` | P1 | OK |
| 06 | Accueil chargement | / | *(non fourni — optionnel)* | P2 | Ignoré |
| 07 | Portfolio liste | /portfolio | `07-portfolio-liste-desktop.webp` | P0 | OK |
| 08 | Portfolio liste | /portfolio | `08-portfolio-liste-mobile.webp` | P0 | OK |
| 09 | Portfolio fiche | /portfolio/slug | `09-portfolio-detail-desktop-presentation-ecole-42.webp` | P0 | OK |
| 10 | Portfolio fiche | /portfolio/slug | `10-portfolio-detail-mobile-presentation-ecole-42.webp` | P1 | OK |
| 11 | Compétences liste | /competences | `11-competences-liste-desktop.webp` | P0 | OK |
| 12 | Compétences liste | /competences | `12-competences-liste-mobile.webp` | P0 | OK |
| 13 | Compétences fiche | /competences/slug | `13-competences-detail-ia-desktop.webp` | P0 | OK |
| 14 | Compétences fiche | /competences/slug | `14-competences-detail-ia-mobile.webp` | P1 | OK |
| 15 | GrasBot ouvert | /competences/slug | `15-competences-grasbot-ouvert-desktop.webp` | P1 | OK |
| 16 | Glossaire modal | /competences/slug | `16-competences-glossaire-ouvert-desktop.webp` | P1 | OK |
| 17 | Contact formulaire | /contact | `17-contact-formulaire-desktop.webp` | P0 | OK |
| 18 | Contact formulaire | /contact | `18-contact-formulaire-mobile.webp` | P0 | OK |
| 19 | Footer | / | `19-layout-footer-desktop.webp` | P1 | OK |
| 20 | Compteur visites | / | `20-layout-compteur-visites-desktop.webp` | P2 | OK |
| 21 | Admin messages | /admin/messages | `21-admin-messages-desktop.webp` | P2 | OK |

**Slugs illustrés :** projet `presentation-ecole-42`, compétence `ia` (Strapi).

## Conventions slug (nouvelles captures)

| Zone | Motif |
|------|--------|
| Portfolio desktop | `09-portfolio-detail-desktop-{slug}.webp` |
| Portfolio mobile | `10-portfolio-detail-mobile-{slug}.webp` |
| Compétences desktop | `13-competences-detail-{slug}-desktop.webp` |
| Compétences mobile | `14-competences-detail-{slug}-mobile.webp` |

## Ordre conseillé (prise de vue)

01–02 chrome, 03–06 accueil, 07–10 portfolio, 11–16 compétences, 17–18 contact, puis 19–21.

## Repères code

| ID | Fichiers |
|----|----------|
| 01–02 | `app/layout.tsx` |
| 03–06 | `app/page.tsx` |
| 07–08 | `app/portfolio/page.jsx` |
| 09–10 | `app/portfolio/[slug]/page.tsx`, `ContentSection.tsx` |
| 11–12 | `app/competences/page.jsx` |
| 13–16 | `ContentSectionCompetences*.tsx`, `ChatBot.js`, `ModalGlossaire.tsx` |
| 17–18 | `app/contact/page.js`, `ContactForm.tsx` |
| 19 | `app/components/Footer.jsx` |
| 20 | `app/layout.tsx` |
| 21 | `app/admin/messages/page.tsx` |