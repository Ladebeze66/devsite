/**
 * 03 — Convertit les téléchargements en WebP (sharp) sous
 *   extract/media-sync-work/webp/{section}/{slug}/{fileId}_{stem}.webp
 * Les SVG sont copiés en .svg (sans conversion raster).
 *
 * Usage : node strapi_extraction/media-sync/03-convert-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { FILE_INVENTORY, DIR_DOWNLOADED, DIR_WEBP, WORK_ROOT } = require("./config");

const MAX_EDGE = 2560;
const WEBP_QUALITY = 82;

function stemFromFilename(filename) {
  const b = path.basename(filename);
  const i = b.lastIndexOf(".");
  return i <= 0 ? b : b.slice(0, i);
}

async function toWebpRaster(srcPath, destPath) {
  const meta = await sharp(srcPath).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  let pipeline = sharp(srcPath).rotate();
  if (w > MAX_EDGE || h > MAX_EDGE) {
    pipeline = pipeline.resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(destPath);
}

async function main() {
  if (!fs.existsSync(FILE_INVENTORY)) {
    console.error("Manque media-inventory.json — lance 01 puis 02.");
    process.exit(1);
  }

  const inventory = JSON.parse(fs.readFileSync(FILE_INVENTORY, "utf8"));
  const files = inventory.files;
  if (!Array.isArray(files) || !files.length) {
    console.log("Rien à convertir.");
    return;
  }

  if (!fs.existsSync(WORK_ROOT)) fs.mkdirSync(WORK_ROOT, { recursive: true });
  if (!fs.existsSync(DIR_WEBP)) fs.mkdirSync(DIR_WEBP, { recursive: true });

  const byId = new Map();
  let ok = 0;
  let err = 0;

  for (const row of files) {
    const id = row.fileId;
    if (!row.relativeDownloadPath) {
      row.relativeWebpPath = null;
      continue;
    }
    if (byId.has(id)) {
      row.relativeWebpPath = byId.get(id);
      continue;
    }

    const src = path.join(DIR_DOWNLOADED, row.relativeDownloadPath);
    if (!fs.existsSync(src)) {
      row.relativeWebpPath = null;
      row.convertError = "fichier téléchargé manquant";
      err++;
      continue;
    }

    const ext = path.extname(src).toLowerCase();
    const baseStem = `${id}_${stemFromFilename(row.filename)}`;
    const relDir = path.join(row.section, row.entrySlug);
    let relOutFile;
    let absOut;

    try {
      if (ext === ".svg") {
        relOutFile = path.join(relDir, `${baseStem}.svg`).replace(/\\/g, "/");
        absOut = path.join(DIR_WEBP, relOutFile);
        fs.mkdirSync(path.dirname(absOut), { recursive: true });
        fs.copyFileSync(src, absOut);
        console.log(`svg-copy       → ${relOutFile}`);
      } else if (ext === ".webp") {
        relOutFile = path.join(relDir, `${baseStem}.webp`).replace(/\\/g, "/");
        absOut = path.join(DIR_WEBP, relOutFile);
        fs.mkdirSync(path.dirname(absOut), { recursive: true });
        fs.copyFileSync(src, absOut);
        console.log(`webp-copy      → ${relOutFile}`);
      } else if ([".png", ".jpg", ".jpeg", ".tif", ".tiff"].includes(ext)) {
        relOutFile = path.join(relDir, `${baseStem}.webp`).replace(/\\/g, "/");
        absOut = path.join(DIR_WEBP, relOutFile);
        await toWebpRaster(src, absOut);
        console.log(`webp-transform → ${relOutFile}`);
      } else {
        relOutFile = path.join(relDir, path.basename(src)).replace(/\\/g, "/");
        absOut = path.join(DIR_WEBP, relOutFile);
        fs.mkdirSync(path.dirname(absOut), { recursive: true });
        fs.copyFileSync(src, absOut);
        console.log(`raw-copy       → ${relOutFile}`);
      }

      row.relativeWebpPath = relOutFile;
      byId.set(id, relOutFile);
      ok++;
    } catch (e) {
      row.relativeWebpPath = null;
      row.convertError = String(e.message);
      err++;
      console.error(`❌ fileId ${id}: ${e.message}`);
    }
  }

  inventory.convertedAt = new Date().toISOString();
  inventory.convertSettings = {
    maxEdgePx: MAX_EDGE,
    webpQuality: WEBP_QUALITY,
  };

  fs.writeFileSync(FILE_INVENTORY, JSON.stringify(inventory, null, 2), "utf8");
  console.log(`\n✅ Fichiers uniques traités : ${ok}, erreurs : ${err}`);
  console.log(`📁 ${DIR_WEBP}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
