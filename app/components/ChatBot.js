"use client";

import { useEffect, useRef, useState } from "react";
import { askAI } from "../utils/askAI";

/**
 * GrasBot — refonte Stitch (étape 7.d).
 *
 * L'API publique ne change pas (`onClose` propagé par le parent). Le bouton
 * d'ouverture n'est plus dans ce composant : il est désormais porté par le FAB
 * global `GrasBotFab` monté dans `app/layout.tsx`. Ce composant se concentre
 * sur le panneau de conversation proprement dit.
 *
 * Détails notables :
 * - Fond `surface-container-lowest/95 backdrop-blur-vellum rounded-sheet shadow-ambient`
 *   (plus de carte opaque `bg-white/70` + ombre lourde).
 * - Header primary avec Material Symbol `smart_toy` (`translate="no"`, règle § 4 quinquies).
 * - Bulles : user = `bg-primary text-white rounded-sheet` à droite, bot =
 *   `bg-surface-container text-on-surface rounded-sheet` à gauche. Corps Manrope.
 * - Input `bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary`,
 *   bouton envoyer jewel avec Material Symbol `send`.
 * - Auto-scroll en bas à chaque nouveau message, envoi à Enter.
 */
export default function ChatBot({ onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

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

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsWaiting(true);

    try {
      const botResponse = await askAI(userMessage.text);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur de réponse. Réessayez plus tard." },
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

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto bg-surface-container-lowest/60 p-4"
      >
        {messages.length === 0 && !isWaiting && (
          <p className="mt-6 text-center font-body italic text-sm text-on-surface-variant">
            Posez-moi une question sur le site, les projets ou les compétences.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-sheet px-3 py-2 font-headline text-xs leading-relaxed ${
              msg.sender === "user"
                ? "ml-auto bg-primary text-white"
                : "mr-auto bg-surface-container text-on-surface"
            }`}
          >
            {msg.text}
          </div>
        ))}

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
