"use client";

import { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

/**
 * FAB "GrasBot" global (étape 7.e).
 *
 * Monté une seule fois dans `app/layout.tsx` pour que le chatbot soit accessible
 * **depuis toutes les pages**, pas seulement depuis les fiches compétences comme
 * avant la refonte.
 *
 * Flux d'ouverture :
 * - Clic direct sur le bouton flottant → ouvre le panneau.
 * - Clic sur un mot-clé `.chatbot-keyword` dans une fiche compétence →
 *   `ContentSectionCompetences` dispatche `window.dispatchEvent(new CustomEvent("grasbot:open"))`,
 *   ce FAB écoute et ouvre le panneau. Pas de Context partagé, pas de store global :
 *   un événement `window` suffit pour un besoin one-shot et découple proprement
 *   le ChatBot de ses points d'entrée.
 *
 * Positionnement :
 * - Bouton : `fixed bottom-6 right-6`, z-index 30 (au-dessus du contenu, en
 *   dessous du header z-20 ? — non : au-dessus, pour rester accessible. On
 *   passe à z-30).
 * - Panneau : `fixed inset-x-4 bottom-24 sm:inset-auto sm:bottom-24 sm:right-6`
 *   → plein largeur mobile (avec 16 px de marge), 384 px desktop.
 */
export default function GrasBotFab() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("grasbot:open", handleOpen);
    return () => window.removeEventListener("grasbot:open", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Fermer GrasBot" : "Ouvrir GrasBot"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-jewel transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed md:h-16 md:w-16"
      >
        <span
          className="material-symbols-outlined text-3xl"
          aria-hidden="true"
          translate="no"
        >
          {isOpen ? "close" : "smart_toy"}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-x-4 bottom-24 z-30 h-[70vh] max-h-[560px] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-96"
          role="dialog"
          aria-modal="false"
          aria-label="Conversation avec GrasBot"
        >
          <ChatBot onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
