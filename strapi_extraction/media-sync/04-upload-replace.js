/**
 * 04 — Ré-upload les WebP générés vers Strapi et remplace les entrées média dans
 * les fiches concernées (API authentifiée).
 *
 * Requiert dans l’env : STRAPI_API_TOKEN (JWT Strapi avec droits upload + mise à jour
 * des collection types utilisés ; typiquement un jeton Full access en local).
 *
 * Par défaut : **dry-run** (aucune mutation).
 * Mutation réelle : node strapi_extraction/media-sync/04-upload-replace.js --execute
 *
 * DANGER : sauvegarder au préalable votre base Strapi / médias. Tester sur une
 * copie locale (Strapi localhost + même base si possible).
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../cmsbackend/.env"),
});
require("dotenv").config({
  path: path.join(__dirname, "../../.env.local"),
});

const {
  FILE_INVENTORY,
  DIR_WEBP,
  API_BASE,
} = require("./config");

const TOKEN = process.env.STRAPI_API_TOKEN;
const EXECUTE = process.argv.includes("--execute");

function mimeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };
  return map[ext] || "application/octet-stream";
}

/** Compte combien de lignes d’inventaire pointent le même fileId */
function countRefs(files) {
  const c = {};
  for (const r of files) {
    c[r.fileId] = (c[r.fileId] || 0) + 1;
  }
  return c;
}

/**
 * Nom réservé multipart (ByteString) : les noms avec caractères hors U+00–U+FF
 * (ex. U+2194 flèches dans des noms générés) provoquent l’erreur Node
 * « Cannot convert argument to a ByteString » sur form.append(..., filename).
 */
function asciiUploadName(filePath, fileId) {
  const ext = path.extname(filePath).toLowerCase();
  const extOk = /^\.(webp|svg|png|jpe?g|gif|avif)$/.test(ext) ? ext : ".webp";
  return `upload-${fileId}${extOk}`;
}

async function postUpload(filePath, fileId) {
  const buf = fs.readFileSync(filePath);
  const asciiName = asciiUploadName(filePath, fileId);
  const blob = new Blob([buf], { type: mimeForFile(filePath) });
  const body = new FormData();
  body.append("files", blob, asciiName);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST /upload ${res.status} ${t.slice(0, 800)}`);
  }
  const json = await res.json();
  const arr = Array.isArray(json) ? json : json?.data;
  if (!Array.isArray(arr) || !arr[0]) {
    throw new Error(`Réponse upload inattendue : ${JSON.stringify(json).slice(0, 400)}`);
  }
  return arr[0];
}

function unwrapEntry(raw) {
  if (!raw) return null;
  if (raw.data) return unwrapEntry(raw.data);
  if (raw.attributes) {
    return {
      ...raw.attributes,
      id: raw.id,
      documentId: raw.documentId,
    };
  }
  return raw;
}

async function getEntryPlural(plural, documentId) {
  const qs = new URLSearchParams({ populate: "*" });
  const url = `${API_BASE}/${plural}/${documentId}?${qs}`;
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GET ${url} → ${res.status} ${t.slice(0, 400)}`);
  }
  const json = await res.json();
  return unwrapEntry(json);
}

function getMediaIdsFromField(entry, fieldName, multiple) {
  const v = entry[fieldName];
  if (multiple) {
    const arr = Array.isArray(v) ? v : [];
    return arr.map((x) => (typeof x === "object" && x !== null ? x.id : x)).filter(Boolean);
  }
  if (!v) return [];
  if (typeof v === "object" && v.id) return [v.id];
  if (typeof v === "number") return [v];
  return [];
}

async function putEntry(plural, documentId, payloadData) {
  const url = `${API_BASE}/${plural}/${documentId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: payloadData }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PUT ${url} → ${res.status} ${t.slice(0, 800)}`);
  }
  return res.json();
}

async function deleteFile(fileId) {
  const url = `${API_BASE}/upload/files/${fileId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE ${url} → ${res.status} ${t.slice(0, 400)}`);
  }
}

async function main() {
  if (!fs.existsSync(FILE_INVENTORY)) {
    console.error("Manque media-inventory.json");
    process.exit(1);
  }

  if (!TOKEN) {
    console.error(
      "STRAPI_API_TOKEN manquant. Crée un jeton API dans Strapi (Settings → API Tokens), puis exporte :\n" +
        "  Windows PowerShell : $env:STRAPI_API_TOKEN=\"…\"\n" +
        "  ou ajoute STRAPI_API_TOKEN dans cmsbackend/.env (non commité)."
    );
    process.exit(1);
  }

  const inventory = JSON.parse(fs.readFileSync(FILE_INVENTORY, "utf8"));
  const files = inventory.files || [];
  const refCount = countRefs(files);

  const candidates = files.filter(
    (r) =>
      r.relativeWebpPath &&
      r.relativeWebpPath.endsWith(".webp") &&
      r.entryDocumentId
  );

  console.log(
    `Lignes inventaire : ${files.length} — candidats WebP remplaçables (avec documentId) : ${candidates.length}`
  );
  console.log(`Mode : ${EXECUTE ? "EXECUTE (mutations réelles)" : "DRY-RUN (aucune mutation)"}\n`);

  if (!EXECUTE) {
    console.log(
      "Exemple d’actions qui seraient effectuées avec --execute :\n" +
        "  1. POST /api/upload pour chaque fichier .webp sous webp/\n" +
        "  2. PUT /api/:collection/:documentId avec le champ média mis à jour (ids)\n" +
        "  3. DELETE /api/upload/files/:oldFileId uniquement si l’ancien id n’a qu’une référence dans l’inventaire\n"
    );
    for (let i = 0; i < Math.min(5, candidates.length); i++) {
      const r = candidates[i];
      console.log(
        ` • fileId=${r.fileId} → ${r.relativeWebpPath} → entrée ${r.collectionPlural} documentId=${r.entryDocumentId} champ=${r.fieldName}[${r.fieldIndex}]`
      );
    }
    console.log("\nAjoute --execute pour réellement téléverser (après avoir testé la sauvegarde).");
    return;
  }

  /** Par sécurité, traite fichier par fichier ; re-fetch après chaque succès évite désalignement indices */
  for (const row of candidates) {
    const src = path.join(DIR_WEBP, row.relativeWebpPath.replace(/\//g, path.sep));
    if (!fs.existsSync(src)) {
      console.warn(`SKIP fileId=${row.fileId} : fichier absent ${src}`);
      continue;
    }

    const docId = row.entryDocumentId;
    const plural = row.collectionPlural;
    const field = row.fieldName;
    const idx = row.fieldIndex;
    const oldId = row.fileId;

    try {
      const uploaded = await postUpload(src, row.fileId);
      const newId = uploaded.id;

      const entry = await getEntryPlural(plural, docId);
      if (!entry) throw new Error("entrée introuvable");

      const multiple = row.fieldMultiple;
      const currentIds = getMediaIdsFromField(entry, field, multiple);

      if (multiple) {
        if (idx < 0 || idx >= currentIds.length) {
          throw new Error(`index ${idx} hors limites (ids actuels : ${currentIds.join(",")})`);
        }
        if (currentIds[idx] !== oldId) {
          throw new Error(
            `id à l’index ${idx} est ${currentIds[idx]}, attendu ${oldId} — arrêt pour éviter corruption`
          );
        }
        const next = currentIds.slice();
        next[idx] = newId;
        await putEntry(plural, docId, { [field]: next });
      } else {
        const cur = currentIds[0];
        if (cur != null && cur !== oldId) {
          throw new Error(`champ simple : attendu ancien id ${oldId}, vu ${cur}`);
        }
        await putEntry(plural, docId, { [field]: newId });
      }

      console.log(`OK upload+remplace : ${oldId} → ${newId} (${plural}/${docId})`);

      const canDeleteOld = refCount[oldId] === 1;
      if (canDeleteOld && oldId !== newId) {
        try {
          await deleteFile(oldId);
          console.log(`   ancien fichier Strapi ${oldId} supprimé`);
        } catch (de) {
          console.warn(`   suppression ancien échouée (non bloquant) : ${de.message}`);
        }
      }
    } catch (e) {
      console.error(`ÉCHEC fileId=${row.fileId} : ${e.message}`);
    }
  }

  console.log("\nTerminé. Recharge les fiches dans l’admin et vide le cache navigateur.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
