/**
 * Helpers — extraire les fichiers média des réponses Strapi v5 (structure plate).
 */

function isUploadedImage(obj) {
  if (!obj || typeof obj !== "object" || typeof obj.url !== "string") return false;
  if (!obj.url.includes("/uploads/")) return false;
  if (obj.mime && !obj.mime.startsWith("image/")) return false;
  return true;
}

/** Liste { file, index } pour un champ média Strapi */
function normalizeField(fieldVal, multiple) {
  if (!fieldVal) return [];
  if (multiple) {
    const arr = Array.isArray(fieldVal) ? fieldVal : [fieldVal];
    return arr
      .filter(isUploadedImage)
      .map((file, index) => ({ file, index }));
  }
  return isUploadedImage(fieldVal)
    ? [{ file: fieldVal, index: 0 }]
    : [];
}

function safeSlug(entry) {
  const s =
    entry.slug ??
    entry.documentId ??
    (entry.id != null ? String(entry.id) : "unknown");
  return String(s)
    .replace(/[^\wÀ-ÖØ-öø-ÿ.-]+/gu, "_")
    .slice(0, 96)
    .replace(/^_|_$/g, "") || "entry";
}

module.exports = {
  normalizeField,
  safeSlug,
  isUploadedImage,
};
