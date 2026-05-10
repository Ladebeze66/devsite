/**
 * Persistance locale du fil GrasBot (sans envoi à Ollama).
 *
 * Clé : `grasbot_chat_v{VERSION}:<user_id>` où `user_id` est celui de `grasbotIds.js`.
 * Limite : les derniers messages uniquement pour éviter quota localStorage (~5 Mo).
 */

import { getGrasbotUserId } from "./grasbotIds";

export const GRASBOT_CHAT_STORAGE_VERSION = 2;
export const GRASBOT_CHAT_MAX_MESSAGES = 80;

function storageKey(userId) {
  return `grasbot_chat_v${GRASBOT_CHAT_STORAGE_VERSION}:${userId}`;
}

function safeRandomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * @param {unknown} m
 * @returns {object | null}
 */
function sanitizeMessage(m) {
  if (!m || typeof m !== "object") return null;
  if (m.sender !== "user" && m.sender !== "bot") return null;
  if (typeof m.text !== "string") return null;
  const out = { sender: m.sender, text: m.text };
  if (typeof m.id === "string") out.id = m.id;
  if (m.sender === "bot") {
    if (Array.isArray(m.sources)) out.sources = m.sources;
    if (typeof m.grounded === "boolean") out.grounded = m.grounded;
    if (typeof m.timeout === "boolean") out.timeout = m.timeout;
    if (typeof m.error === "boolean") out.error = m.error;
  }
  return out;
}

/** @returns {object[]} */
export function loadGrasbotChatMessages() {
  if (typeof window === "undefined") return [];
  try {
    const uid = getGrasbotUserId();
    if (!uid) return [];
    const raw = window.localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeMessage).filter(Boolean);
  } catch {
    return [];
  }
}

/** @param {object[]} messages */
export function saveGrasbotChatMessages(messages) {
  if (typeof window === "undefined") return;
  try {
    const uid = getGrasbotUserId();
    if (!uid) return;
    const trimmed = messages.slice(-GRASBOT_CHAT_MAX_MESSAGES);
    const serialized = trimmed.map(sanitizeMessage).filter(Boolean);
    window.localStorage.setItem(storageKey(uid), JSON.stringify(serialized));
  } catch {
    // quota / mode privé strict
  }
}

export function clearGrasbotChatMessages() {
  if (typeof window === "undefined") return;
  try {
    const uid = getGrasbotUserId();
    if (!uid) return;
    window.localStorage.removeItem(storageKey(uid));
  } catch {
    /* ignore */
  }
}

export function newChatMessageId() {
  return safeRandomId();
}
