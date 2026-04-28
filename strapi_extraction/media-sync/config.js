/**
 * Configuration partagée — sync médias Strapi (téléchargement / WebP / ré-upload).
 * Variables d'environnement (optionnelles) :
 *   STRAPI_URL          — origine sans /api (ex. https://api.fernandgrascalvet.com ou http://localhost:1337)
 *   STRAPI_API_TOKEN    — jeton API Strapi (requis pour 04-upload-replace.js --execute)
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });
require("dotenv").config({ path: require("path").join(__dirname, "../../cmsbackend/.env") });

const path = require("path");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://api.fernandgrascalvet.com";

const API_BASE = `${STRAPI_URL}/api`;

/** Sortie : mirrors extract/ existant (gitignored lourd) */
const WORK_ROOT = path.join(__dirname, "../extract/media-sync-work");
const DIR_DOWNLOADED = path.join(WORK_ROOT, "downloaded");
const DIR_WEBP = path.join(WORK_ROOT, "webp");
const FILE_INVENTORY = path.join(WORK_ROOT, "media-inventory.json");

/**
 * Content-types avec champs média — aligné sur cmsbackend/src/api (schema.json par type).
 * section = sous-dossier humain (portfolio, competences, …)
 */
const COLLECTIONS = [
  {
    plural: "projects",
    singular: "project",
    ref: "api::project.project",
    section: "portfolio",
    fields: [{ name: "picture", multiple: true }],
  },
  {
    plural: "competences",
    singular: "competence",
    ref: "api::competence.competence",
    section: "competences",
    fields: [{ name: "picture", multiple: true }],
  },
  {
    plural: "homepages",
    singular: "homepage",
    ref: "api::homepage.homepage",
    section: "home",
    fields: [{ name: "photo", multiple: false }],
  },
  {
    plural: "realisation-ias",
    singular: "realisation-ia",
    ref: "api::realisation-ia.realisation-ia",
    section: "realisation-ias",
    fields: [{ name: "picture", multiple: true }],
  },
  {
    plural: "glossaires",
    singular: "glossaire",
    ref: "api::glossaire.glossaire",
    section: "glossaire",
    fields: [{ name: "images", multiple: true }],
  },
];

const PAGE_SIZE = 100;

module.exports = {
  STRAPI_URL,
  API_BASE,
  WORK_ROOT,
  DIR_DOWNLOADED,
  DIR_WEBP,
  FILE_INVENTORY,
  COLLECTIONS,
  PAGE_SIZE,
};
