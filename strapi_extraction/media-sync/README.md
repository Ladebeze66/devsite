# Pipeline médias Strapi → dossiers par section → WebP → ré-upload optionnel

**Répertoire de travail (lourd)** : `strapi_extraction/extract/media-sync-work/` — ignoré par Git (`/.gitignore`).

## Prérequis

- Node 18+
- Dépendance `sharp` installée depuis la racine (`npm install` déjà fait si le dépôt à jour).

## Variables optionnelles

| Variable | Rôle |
|----------|------|
| `STRAPI_URL` | Origine Strapi sans `/api` (défaut depuis `NEXT_PUBLIC_API_URL` ou prod). |
| `STRAPI_API_TOKEN` | **Seulement** pour `04-upload-replace.js --execute`. Jeton créé dans Strapi → Settings → API Tokens (droits lecture + Upload + mise à jour des CT concernés). Ne pas committer ce jeton. |

Chemins `.env.local` à la racine et `cmsbackend/.env` sont chargés par les scripts (`config.js` ou `04`).

## Chaîne normale

```powershell
# depuis la racine du repo J:\my-next-site

npm run media:inventory        # 01 — liste tous les médias utilisés → media-inventory.json

npm run media:download           # 02 — téléchargement physique par section sous downloaded/

npm run media:webp               # 03 — conversion/copies sous webp/

npm run media:upload             # 04 — dry-run uniquement (aucune mutation)

# Mutation CMS (**attention**) après lecture ci‑dessous :

$env:STRAPI_API_TOKEN="<jeton>"
node strapi_extraction/media-sync/04-upload-replace.js --execute
```

### Organisation des dossiers

- **`downloaded/{section}/{slug-du-contenu}/{fileId}_{nom-fichier}`**  
  Sections : `portfolio`, `competences`, `home`, `realisation-ias`, `glossaire`.
- **`webp/...`** même structure, avec `.webp` (ou `.svg` copié en clair).

Les **fichiers média uniques** sont dédupliqués par `fileId` : une seule fois sur disque, plusieurs lignes dans l’inventaire peuvent référencer le même téléchargement.

### Erreur « Cannot convert argument to a ByteString » (upload)

Les noms de fichiers sur disque peuvent contenir des caractères Unicode (tirets fins, flèches dans des noms AI, etc.). Le `FormData` HTTP n’accepte qu’un nom de fichier **ASCII** dans l’en-tête multipart ; le script **`04-upload-replace.js`** renomme donc en interne chaque envoi en `upload-{fileId}.webp` (voir `asciiUploadName` dans le fichier). Relance `--execute` après mise à jour du script.

### Avant le `--execute` sur la prod

1. **Tester d’abord** contre une instance Strapi locale (ex. importer la base vers `cmsbackend`, `npm run develop`, puis `$env:STRAPI_URL="http://localhost:1337"` et un jeton local).
2. **Sauvegarder** la base et `/public/uploads`.
3. Lire le préambule dans `04-upload-replace.js` ; le script vérifie que l’ancien id correspond encore avant remplacement pour limiter les corruptions.

## Si l’étape ré-upload vous suffit après conversion manuelle

Vous pouvez aussi **importer uniquement les WebP** depuis l’admin Strapi puis réassigner les champs à la main ; ce dépôt ne vous oblige pas à utiliser `04`.
