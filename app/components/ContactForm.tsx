"use client";

import { useState } from "react";
import { sendMessage } from "../utils/sendMessage";

/**
 * Formulaire de contact — refonte "Digital Atelier" (étape 8).
 *
 * - Plus de `bg-white shadow-lg rounded-lg` sur le form : il est désormais
 *   monté dans la carte vellum de `app/contact/page.js`.
 * - Champs : `bg-surface-container-low`, radius `rounded-tile`, `focus-visible:ring-2 focus-visible:ring-primary`.
 * - CTA jewel : `bg-primary text-on-primary shadow-jewel` avec Material Symbol
 *   `send` + effet `-translate-y-0.5` au hover, état disabled en `bg-outline-variant/60`.
 * - Bandeau status Stitch : succès en `primary-fixed`, erreur en `error-container`,
 *   chargement en `surface-container`. Chaque état porte une Material Symbol.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const isLoading = statusKind === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Tous les champs sont obligatoires.");
      setStatusKind("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Email invalide.");
      setStatusKind("error");
      return;
    }

    setStatus("Envoi en cours…");
    setStatusKind("loading");

    try {
      await sendMessage(name, email, message);
      setStatus("Message envoyé. Merci, je reviens vers vous rapidement.");
      setStatusKind("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("Erreur lors de l'envoi du message.");
      setStatusKind("error");
    }
  };

  const statusStyles: Record<typeof statusKind, string> = {
    idle: "",
    loading:
      "bg-surface-container text-on-surface-variant",
    success:
      "bg-primary-fixed/70 text-on-primary-fixed",
    error: "bg-error-container text-on-error-container",
  };

  const statusIcon: Record<typeof statusKind, string> = {
    idle: "",
    loading: "hourglass_top",
    success: "check_circle",
    error: "error",
  };

  const fieldClass =
    "w-full rounded-tile bg-surface-container-low/90 px-4 py-3 font-body text-base text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <label className="flex flex-col gap-1">
        <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
          Votre nom
        </span>
        <input
          type="text"
          placeholder="Prénom Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          required
          autoComplete="name"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
          Votre email
        </span>
        <input
          type="email"
          placeholder="adresse@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
          required
          autoComplete="email"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
          Votre message
        </span>
        <textarea
          placeholder="Quelques mots sur votre projet, question ou intention…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={`${fieldClass} min-h-[9rem] resize-y`}
          required
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className={`mt-1 inline-flex items-center justify-center gap-2 rounded-tile px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isLoading
            ? "cursor-not-allowed bg-outline-variant/60 text-on-surface-variant"
            : "bg-primary text-on-primary shadow-jewel hover:-translate-y-0.5"
        }`}
      >
        <span
          className="material-symbols-outlined text-base"
          aria-hidden="true"
          translate="no"
        >
          {isLoading ? "hourglass_top" : "send"}
        </span>
        {isLoading ? "Envoi…" : "Envoyer"}
      </button>

      {statusKind !== "idle" && status && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-2 flex items-center gap-2 rounded-tile px-4 py-3 font-body text-sm ${statusStyles[statusKind]}`}
        >
          <span
            className="material-symbols-outlined text-base"
            aria-hidden="true"
            translate="no"
          >
            {statusIcon[statusKind]}
          </span>
          <span className="min-w-0">{status}</span>
        </div>
      )}
    </form>
  );
}
