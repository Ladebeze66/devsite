/**
 * 01 — Appelle l’API Strapi (lecture publique) et produit media-inventory.json
 * (liste de tous les fichiers image liés aux content-types configurés).
 *
 * Usage : node strapi_extraction/media-sync/01-fetch-inventory.js
 */
const fs = require("fs");
const path = require("path");
const {
  API_BASE,
  WORK_ROOT,
  FILE_INVENTORY,
  COLLECTIONS,
  PAGE_SIZE,
} = require("./config");
const { normalizeField, safeSlug } = require("./lib/collect-media");

function unwrapEntry(entry) {
  if (!entry) return null;
  if (entry.attributes) {
    return {
      ...entry.attributes,
      id: entry.id,
      documentId: entry.documentId,
    };
  }
  return entry;
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`HTTP ${r.status} ${url}\n${txt.slice(0, 500)}`);
  }
  return r.json();
}

async function fetchAllEntries(plural) {
  const out = [];
  let page = 1;
  /* eslint-disable no-constant-condition */
  while (true) {
    const params = new URLSearchParams();
    params.set("pagination[page]", String(page));
    params.set("pagination[pageSize]", String(PAGE_SIZE));
    /**
     * Strapi v5 : populate[picture]=* peut provoquer « Invalid key related » selon versions.
     * populate=* hydrate les relations premier niveau (y compris les médias).
     */
    params.set("populate", "*");

    const url = `${API_BASE}/${plural}?${params}`;
    const json = await fetchJson(url);
    const rows = Array.isArray(json.data) ? json.data : [];
    for (const row of rows) {
      out.push(unwrapEntry(row));
    }
    const pageCount = json.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount || rows.length === 0) break;
    page += 1;
    await new Promise((r) => setTimeout(r, 200));
  }
  return out;
}

async function main() {
  console.log("🔍 STRAPI_URL (origine) →", require("./config").STRAPI_URL);
  console.log("🔍 API_BASE →", API_BASE);

  if (!fs.existsSync(WORK_ROOT)) {
    fs.mkdirSync(WORK_ROOT, { recursive: true });
  }

  const inventory = {
    generatedAt: new Date().toISOString(),
    apiBase: API_BASE,
    files: [],
  };

  /** @type {typeof inventory.files} */
  const records = [];

  for (const col of COLLECTIONS) {
    console.log(`\n📂 ${col.plural} (${col.section})…`);
    let entries;
    try {
      entries = await fetchAllEntries(col.plural);
    } catch (e) {
      console.error(`   ⚠️  Endpoint indisponible ou erreur : ${e.message}`);
      continue;
    }

    console.log(`   ${entries.length} entrée(s)`);

    for (const entry of entries) {
      if (!entry) continue;
      const slug = safeSlug(entry);

      for (const field of col.fields) {
        const items = normalizeField(entry[field.name], field.multiple);
        for (const { file, index } of items) {
          const base = path.basename(file.url.split("?")[0] || "file");
          records.push({
            collectionPlural: col.plural,
            collectionSingular: col.singular,
            strapiRef: col.ref,
            section: col.section,
            entrySlug: slug,
            entryId: entry.id,
            entryDocumentId: entry.documentId ?? null,
            fieldName: field.name,
            fieldMultiple: field.multiple,
            fieldIndex: index,
            fileId: file.id,
            fileDocumentId: file.documentId ?? null,
            filename: file.name || base,
            url: file.url,
            mime: file.mime,
            size: file.size,
            ext: file.ext,
            /** chemin relatif WORK_ROOT/downloaded/... rempli par 02 */
            relativeDownloadPath: null,
          });
        }
      }
    }
  }

  inventory.files = records.slice().sort((a, b) => a.fileId - b.fileId);

  fs.writeFileSync(FILE_INVENTORY, JSON.stringify(inventory, null, 2), "utf8");
  console.log(`\n✅ Inventaire : ${inventory.files.length} fichier(s) → ${FILE_INVENTORY}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
