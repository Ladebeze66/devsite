"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askAI } from "../utils/askAI";
import {
  clearGrasbotChatMessages,
  loadGrasbotChatMessages,
  newChatMessageId,
  saveGrasbotChatMessages,
} from "../utils/grasbotChatStorage";
import { getGrasbotSourceIconName, resolveGrasbotSourceHref } from "../utils/grasbotSourceUrl";

/**
 * GrasBot — UI du chatbot (Stitch).
 *
 * L'API publique ne change pas (`onClose` propagé par le parent). Le bouton
 * d'ouverture est porté par le FAB global `GrasBotFab` monté dans
 * `app/layout.tsx`. Ce composant se concentre sur le panneau de conversation.
 *
 * v3 (2026-04-22) — bascule retrieval graph + BM25 :
 * - Affichage des `sources` renvoyées par l'API (pill par source). L'URL est
 *   résolue via `resolveGrasbotSourceHref` (API `url` / `route_parent` + fallback
 *   pour l'historique localStorage sans métadonnées à jour).
 * - Badge `grounded` sous chaque réponse (paperclip si sources exploitées,
 *   info si réponse générale faute de contexte pertinent).
 * - Timeout 45 s côté fetch (géré dans `askAI.js`) avec message éditorial.
 *
 * v3.2 (2026-04-26) :
 * - Réponses bot rendues en Markdown (`ReactMarkdown` + `remark-gfm`) : gras,
 *   listes, liens cliquables. Texte justifié dans la bulle. Les messages
 *   utilisateur restent en texte brut.
 *
 * v3.3 (2026-04-26) :
 * - Historique persisté en **localStorage** par `grasbot_user_id` (voir
 *   `grasbotChatStorage.js`) : même navigateur / effacement cookies selon usage,
 *   jusqu'à 80 messages récents. Aucune réinjection dans Ollama.
 * - Bouton pour effacer la conversation locale.
 *
 * Design :
 * - Fond `surface-container-lowest/95 backdrop-blur-vellum rounded-sheet shadow-ambient`.
 * - Bulles : user = `bg-primary text-white` à droite, bot = `bg-surface-container` à gauche.
 * - Sources : petites pills `bg-surface-container-low text-primary` sous la bulle bot.
 * - Auto-scroll en bas, envoi à Enter, focus auto, disabled pendant attente.
 */
export default function ChatBot({ onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    setMessages(loadGrasbotChatMessages());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGrasbotChatMessages(messages);
  }, [messages, hydrated]);

  const handleClearHistory = () => {
    setMessages([]);
    clearGrasbotChatMessages();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isWaiting]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAsk = async () => {
    if (!question.trim() || isWaiting) return;

    const userMessage = { sender: "user", text: question, id: newChatMessageId() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsWaiting(true);

    try {
      const payload = await askAI(userMessage.text);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: payload.response,
          sources: payload.sources || [],
          grounded: Boolean(payload.grounded),
          timeout: Boolean(payload._timeout),
          id: newChatMessageId(),
        },
      ]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Erreur de réponse. Réessayez plus tard.",
          sources: [],
          grounded: false,
          error: true,
          id: newChatMessageId(),
        },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-sheet bg-surface-container-lowest/95 shadow-ambient backdrop-blur-vellum">
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="material-symbols-outlined text-2xl"
            aria-hidden="true"
            translate="no"
          >
            smart_toy
          </span>
          <div className="min-w-0">
            <p className="truncate font-headline text-sm font-bold tracking-tight">GrasBot</p>
            <p className="truncate font-headline text-[10px] uppercase tracking-[0.25em] text-primary-fixed">
              Assistant IA locale
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleClearHistory}
            disabled={messages.length === 0}
            aria-label="Effacer l'historique de conversation"
            title="Effacer l'historique"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true" translate="no">
              delete_sweep
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le chat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed"
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              translate="no"
            >
              close
            </span>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto bg-surface-container-lowest/60 p-4"
      >
        {messages.length === 0 && !isWaiting && (
          <p className="mt-6 text-center font-body italic text-sm text-on-surface-variant">
            Posez-moi une question sur le site, les projets ou les compétences.
          </p>
        )}

        {messages.map((msg, index) => {
          const msgKey = msg.id ?? `legacy-${index}`;
          if (msg.sender === "user") {
            return (
              <div
                key={msgKey}
                className="ml-auto max-w-[80%] rounded-sheet bg-primary px-3 py-2 font-headline text-xs leading-relaxed text-white"
              >
                {msg.text}
              </div>
            );
          }
          return (
            <div key={msgKey} className="mr-auto flex max-w-[85%] flex-col gap-1.5">
              <div
                className="rounded-sheet bg-surface-container px-3 py-2 text-on-surface [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm max-w-none text-justify font-body text-xs leading-relaxed text-on-surface
                    prose-p:my-2 prose-p:text-xs prose-p:leading-relaxed
                    prose-strong:font-semibold prose-strong:text-on-surface
                    prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:text-xs
                    prose-a:break-words prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-headings:font-headline prose-headings:text-sm prose-headings:text-on-surface prose-headings:my-2
                    prose-code:rounded prose-code:bg-surface-container-low prose-code:px-1 prose-code:text-[11px]
                    prose-pre:my-2 prose-pre:bg-surface-container-low prose-pre:text-[11px]"
                  components={{
                    a({ href, children, ...props }) {
                      const external =
                        typeof href === "string" && /^https?:\/\//i.test(href);
                      return (
                        <a
                          href={href}
                          {...props}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {(msg.sources?.length > 0 || msg.grounded !== undefined) && !msg.error && !msg.timeout && (
                <BotFooter sources={msg.sources} grounded={msg.grounded} />
              )}
            </div>
          );
        })}

        {isWaiting && (
          <div
            className="wait-animation mr-auto inline-flex max-w-[80%] items-end gap-0.5 rounded-sheet bg-surface-container px-3 py-2 font-headline text-xs text-on-surface-variant"
            aria-live="polite"
          >
            GrasBot réfléchit
            <span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-outline-variant/30 bg-surface-container-lowest/80 p-3">
        <input
          ref={inputRef}
          type="text"
          className="min-w-0 flex-1 rounded-tile bg-surface-container-low px-3 py-2 font-headline text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Votre question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isWaiting}
          aria-label="Votre question pour GrasBot"
        />
        <button
          type="button"
          onClick={handleAsk}
          disabled={isWaiting || !question.trim()}
          aria-label="Envoyer la question"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-jewel transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          <span
            className="material-symbols-outlined text-lg"
            aria-hidden="true"
            translate="no"
          >
            send
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * Sous-composant : pied d'une réponse bot avec badge grounded + sources.
 * Extrait pour alléger la lisibilité et garder les styles groupés.
 */
function BotFooter({ sources, grounded }) {
  // Filtrer les sources internes sans url + dédoublonner par slug
  const uniqueSources = [];
  const seen = new Set();
  for (const s of sources || []) {
    if (!s?.slug || seen.has(s.slug)) continue;
    seen.add(s.slug);
    uniqueSources.push(s);
  }
  const clickable = uniqueSources.filter((s) => resolveGrasbotSourceHref(s) !== "#");
  const displayed = clickable.slice(0, 4);

  return (
    <div className="flex flex-wrap items-center gap-1.5 pl-1 text-[10px]">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-headline uppercase tracking-[0.15em] ${
          grounded
            ? "bg-primary/10 text-primary"
            : "bg-surface-container text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined text-[12px]" aria-hidden="true" translate="no">
          {grounded ? "verified" : "info"}
        </span>
        {grounded ? "Basé sur le vault" : "Réponse générale"}
      </span>
      {displayed.map((s) => {
        const href = resolveGrasbotSourceHref(s);
        return (
          <Link
            key={s.slug}
            href={href}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2 py-0.5 font-headline text-[10px] text-primary transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={s.title}
          >
            <span className="material-symbols-outlined text-[12px]" aria-hidden="true" translate="no">
              {getGrasbotSourceIconName(s, href)}
            </span>
            {s.slug}
          </Link>
        );
      })}
    </div>
  );
}
