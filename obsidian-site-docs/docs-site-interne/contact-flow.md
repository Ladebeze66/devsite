# Flux "Contact" — notification par email (Brevo)

**Créé :** 2026-04-23  
**Statut :** en production

## Vue d'ensemble

Le formulaire de contact du site envoie un **email de notification** sur la boîte Gmail personnelle (`grascalvet.fernand@gmail.com`), via l'**API HTTP transactionnelle de Brevo**.

**Plus aucun passage par Strapi pour les messages.** Le content-type `message` a été supprimé (ainsi que la page admin associée) le 2026-04-23. La table SQLite `messages` reste présente en base pour l'historique, mais n'est plus écrite ni lue.

```
Visiteur → /contact (Next.js front)
           ↓
         POST /api/contact  (Next.js App Router, server runtime)
           ↓
         Validation + honeypot + rate-limit
           ↓
         POST https://api.brevo.com/v3/smtp/email
           ↓
         Gmail : CONTACT_TO_EMAIL
```

## Pourquoi cette architecture

### Simplification par rapport à l'ancien flux

Avant : `Front → Strapi POST /api/messages → SQLite` + consultation via `/admin/messages` (page publique, non protégée).

Problèmes :
- **Pas de notification** : il fallait penser à consulter l'admin pour voir les nouveaux messages.
- **Page admin exposée** : `/admin/messages` accessible à n'importe qui en clair (pas d'authentification). Fuite potentielle d'emails privés des visiteurs.
- **Content-type dédié** pour un usage limité (3 champs, pas d'historique utile).

Après : notification directe sur Gmail, zéro stockage intermédiaire, zéro page à sécuriser.

### Pourquoi l'API HTTP Brevo plutôt que SMTP

Discussion menée le 2026-04-23. Résumé :

| Critère | SMTP | API HTTP |
|---------|------|----------|
| Simplicité plugin Strapi | ✓ | (custom) |
| Port potentiellement bloqué | oui | non (HTTPS 443) |
| Débogage JSON | non | ✓ |
| Notre besoin (1 endroit, 1 mail) | ok | ok |

Comme on ne passe plus par Strapi, l'avantage "plugin Strapi" disparaît. On a pris **l'API HTTP** pour rester 100 % en HTTPS (aucun souci de port) et avoir des erreurs JSON lisibles.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `app/api/contact/route.ts` | Endpoint serveur Next.js qui reçoit le form et appelle Brevo |
| `app/components/ContactForm.tsx` | UI côté client, honeypot, gestion du status |
| `.env.local` | Secrets + config (non committé) |
| `.env.example` | Template documentaire des variables à remplir |

## Variables d'environnement

À définir dans `.env.local` (voir `.env.example` pour la structure) :

| Variable | Description | Où l'obtenir |
|----------|-------------|--------------|
| `BREVO_API_KEY` | Clé API Brevo | [app.brevo.com → SMTP & API → API Keys](https://app.brevo.com/settings/keys/api) |
| `CONTACT_FROM_EMAIL` | Expéditeur **vérifié** | Senders, Domains & IPs → Senders (pastille SPF/DKIM verte) |
| `CONTACT_FROM_NAME` | Nom affiché dans Gmail | Texte libre, ex. "Portfolio — nouveau message" |
| `CONTACT_TO_EMAIL` | Destinataire final | L'adresse Gmail personnelle |
| `CONTACT_TO_NAME` | Nom du destinataire | Texte libre |

**L'expéditeur doit être vérifié dans Brevo** : sinon Brevo renvoie une erreur au `POST`. On peut réutiliser l'expéditeur newsletter (pas de cloisonnement côté Brevo) et surcharger le nom d'affichage via `CONTACT_FROM_NAME`.

## Anti-abus

### Honeypot

Un champ caché `website` est ajouté au formulaire :

- Invisible aux humains (`position: absolute; left: -10000px; width: 1px`).
- Masqué aux lecteurs d'écran (`aria-hidden="true"`).
- Ignoré par le clavier (`tabindex="-1"`, `autocomplete="off"`).

Les bots qui parsent le DOM remplissent systématiquement tous les champs texte. Côté serveur, si `website` est non vide :

- On **renvoie un 200 silencieux** (pas de signal d'erreur aux bots → ils ne retentent pas).
- On **n'envoie pas d'email**.
- On **logue** un warning avec l'IP pour monitoring.

### Rate-limit

`app/api/contact/route.ts` limite à **3 envois par IP par fenêtre de 10 minutes**, via une `Map` en mémoire :

```ts
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
```

Au-delà : réponse `429 Too Many Requests` avec header `Retry-After`.

**Limite connue** : en déploiement serverless avec plusieurs instances (Vercel free, Cloudflare Workers), la `Map` n'est pas partagée — le rate-limit est "best effort". Pour un portfolio, c'est acceptable. Pour du vrai ship : passer à Redis ou [Upstash](https://upstash.com/) (wrapper compatible serverless).

### Validation

Côté serveur (défense en profondeur, jamais faire confiance au client) :

- Champs requis non vides : `name`, `email`, `message`.
- Longueurs max : `name ≤ 120`, `email ≤ 160`, `message ≤ 5000` caractères (retourne `413`).
- Format email : regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` (pragmatique, pas RFC 5322 stricte).

Les codes d'erreur renvoyés au client sont en `UPPER_SNAKE_CASE` (stables pour l'i18n future) : `MISSING_FIELDS`, `INVALID_EMAIL`, `TOO_LONG`, `RATE_LIMITED`, `BREVO_ERROR`, `BREVO_UNREACHABLE`, `SERVER_MISCONFIGURED`, `INVALID_JSON`.

## Format de l'email reçu

- **Sujet** : `Nouveau message portfolio — {Nom du visiteur}`
- **Expéditeur** : `{CONTACT_FROM_NAME} <{CONTACT_FROM_EMAIL}>`
- **Reply-To** : email du visiteur → cliquer "Répondre" dans Gmail écrit directement au visiteur.
- **Corps HTML** : carte Stitch simplifiée (palette primary / secondary) avec table récap (nom, email, date, IP) + zone message `pre-wrap`.
- **Corps texte** (fallback) : version plain text équivalente.
- **Tags Brevo** : `["portfolio", "contact-form"]` pour filtrer dans les statistiques Brevo si besoin.

## Procédure de test

### Local (développement)

1. S'assurer que `.env.local` contient les 5 variables requises + une clé Brevo valide.
2. `npm run dev` dans le repo Next (port 3000).
3. `/contact` → remplir le formulaire avec une **adresse email qu'on contrôle** (pour vérifier le Reply-To).
4. Vérifier :
   - Feedback visuel "Message envoyé" en succès Stitch vert.
   - Réception dans Gmail avec expéditeur = `CONTACT_FROM_NAME`.
   - Clic "Répondre" → destinataire = l'email saisi dans le formulaire.

### Honeypot

1. Ouvrir la console DevTools, onglet Elements.
2. Trouver l'input caché `<input name="website">` (dans un div `position: absolute; left: -10000px`).
3. Y saisir une valeur (ex. "bot").
4. Soumettre le formulaire normalement.
5. Résultat attendu : UI affiche "Message envoyé" (succès silencieux) MAIS **aucun email n'arrive** dans Gmail.
6. Vérifier le warning serveur dans les logs Next (`[/api/contact] Honeypot déclenché`).

### Rate-limit

1. Envoyer un formulaire valide 4 fois de suite (modifier juste le message à chaque fois).
2. Au 4ᵉ envoi : réponse `429`, UI affiche "Trop d'envois depuis votre IP. Réessayez dans quelques minutes."
3. Attendre 10 min puis réessayer → doit repasser.

## Nettoyage de l'ancienne table SQLite (optionnel)

La table `messages` existe toujours dans `cmsbackend/.tmp/data.db` (ou le fichier configuré). Strapi ne la touche plus. Pour la supprimer proprement :

```bash
# Arrêter Strapi d'abord !
cd cmsbackend
sqlite3 .tmp/data.db "DROP TABLE IF EXISTS messages;"
sqlite3 .tmp/data.db "DROP TABLE IF EXISTS messages_cmps;"
# Reprise normale
npm run develop
```

Non fait par défaut : la table reste orpheline mais inoffensive. Ça évite toute régression en cas de rollback éventuel.

## Quotas Brevo

Le **plan gratuit Brevo** inclut traditionnellement **300 emails transactionnels par jour**, partagés avec la newsletter. Pour un portfolio qui reçoit 0 à 5 messages par semaine, c'est largement suffisant.

Si le site reçoit un jour beaucoup plus de trafic (ou si Brevo change ses quotas gratuits), surveiller :

- **Brevo → Transactional → Statistics** : nombre d'envois, taux d'erreur.
- **Brevo → SMTP & API → Statistics** : quota quotidien consommé.

## Rollback

Si le flux Brevo tombe en panne (compte suspendu, quota dépassé, clé compromise) et qu'on veut **temporairement** retomber sur le flux Strapi ancien :

1. `git checkout <commit-pre-refonte-contact>` sur les fichiers : `app/api/contact/route.ts` (supprimer), `app/components/ContactForm.tsx` (restaurer `sendMessage`), `app/utils/sendMessage.ts` (restaurer), `cmsbackend/src/api/message/` (restaurer les 4 fichiers), et `app/admin/messages/page.tsx` si on veut la page de consultation.
2. Re-démarrer Strapi pour qu'il régénère le content-type en mémoire.
3. Vérifier les **permissions publiques** sur `POST /api/messages` dans l'admin Strapi (peut avoir besoin d'être recoché).

Préférable : **renouveler la clé Brevo** plutôt que rollback.

## Sécurité — rappels

- **Ne jamais committer `.env.local`**. Déjà dans `.gitignore` (`.env*`).
- **Si la clé Brevo fuit** (exposée dans un commit, un chat, un screenshot) : la **supprimer immédiatement** sur Brevo et en générer une nouvelle. Une clé compromise permet d'envoyer des emails frauduleux depuis l'expéditeur vérifié, ce qui peut faire blacklister le domaine.
- L'**IP du visiteur** est loguée dans l'email (pour abus). À supprimer des emails si on veut un template plus "commercial".
