/**
 * 02 — Télécharge chaque fichier unique de l’inventaire vers
 *   extract/media-sync-work/downloaded/{section}/{slug}/...
 * et met à jour relativeDownloadPath dans media-inventory.json
 *
 * Usage : node strapi_extraction/media-sync/02-download.js
 */
const fs = require("fs");
const path = require("path");
const { STRAPI_URL, FILE_INVENTORY, WORK_ROOT, DIR_DOWNLOADED } = require("./config");

function safeFilePart(name) {
  return String(name || "file")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .slice(0, 180);
}

function absoluteUrl(relativeOrAbsolute) {
  if (relativeOrAbsolute.startsWith("http://") || relativeOrAbsolute.startsWith("https://")) {
    return relativeOrAbsolute;
  }
  return `${STRAPI_URL}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`;
}

async function downloadBuffer(url) {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`HTTP ${r.status} ${url}`);
  }
  const buf = Buffer.from(await r.arrayBuffer());
  return buf;
}

async function main() {
  if (!fs.existsSync(FILE_INVENTORY)) {
    console.error("Manque l’inventaire. Lance d’abord : 01-fetch-inventory.js");
    process.exit(1);
  }

  const raw = fs.readFileSync(FILE_INVENTORY, "utf8");
  const inventory = JSON.parse(raw);
  const files = inventory.files;
  if (!Array.isArray(files) || files.length === 0) {
    console.log("Inventaire vide — rien à télécharger.");
    return;
  }

  if (!fs.existsSync(DIR_DOWNLOADED)) {
    fs.mkdirSync(DIR_DOWNLOADED, { recursive: true });
  }

  const byId = new Map();
  let ok = 0;
  let skipped = 0;
  let fail = 0;

  for (const row of files) {
    const id = row.fileId;
    if (byId.has(id)) {
      row.relativeDownloadPath = byId.get(id);
      skipped++;
      continue;
    }

    const rel = path.join(
      row.section,
      row.entrySlug,
      `${id}_${safeFilePart(row.filename)}`
    );
    const abs = path.join(DIR_DOWNLOADED, rel);

    try {
      const url = absoluteUrl(row.url);
      const buf = await downloadBuffer(url);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, buf);
      row.relativeDownloadPath = rel.replace(/\\/g, "/");
      byId.set(id, row.relativeDownloadPath);
      ok++;
      console.log(`✅ ${rel} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`❌ fileId=${id} : ${e.message}`);
      row.relativeDownloadPath = null;
      row.downloadError = String(e.message);
      fail++;
    }
  }

  inventory.downloadedAt = new Date().toISOString();
  inventory.stats = {
    uniqueFiles: byId.size,
    rowsTotal: files.length,
    downloadedOk: ok,
    dedupSkipped: skipped,
    failed: fail,
  };

  fs.writeFileSync(FILE_INVENTORY, JSON.stringify(inventory, null, 2), "utf8");
  console.log(`\n📁 Base téléchargements : ${DIR_DOWNLOADED}`);
  console.log(
    `Résumé : ${ok} téléchargement(s), ${skipped} lignes réutilisent un fichier déjà pris, ${fail} échec(s).`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
