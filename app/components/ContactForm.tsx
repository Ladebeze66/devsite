"use client";

import { useState } from "react";

/**
 * Formulaire de contact — refonte "Digital Atelier" (étape 8) + envoi via Brevo (étape 9).
 *
 * Architecture :
 *   Form → POST /api/contact (Next.js server route, voir app/api/contact/route.ts)
 *         ↓
 *     Brevo API HTTP → Gmail
 *
 * Plus de passage par Strapi pour les messages : la route serveur valide,
 * filtre (honeypot + rate-limit), puis envoie une notification email. Voir
 * `docs-site-interne/contact-flow.md` pour l'architecture détaillée.
 *
 * Anti-spam :
 *   - Champ honeypot `website` caché (sr-only + tabindex=-1). Les bots le
 *     remplissent systématiquement, les humains non. Côté serveur, un champ
 *     rempli → succès silencieux (aucun email envoyé).
 *   - Rate-limit côté serveur : 3 envois / 10 min / IP (voir route.ts).
 *   - Validation longueur + format email côté serveur en plus du client.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot : doit rester vide. S'il est rempli, on soumet quand même pour ne
  // rien changer côté UX (le serveur ignore silencieusement ces payloads).
  const [website, setWebsite] = useState("");
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      if (res.status === 429) {
        setStatus(
          "Trop d'envois depuis votre IP. Réessayez dans quelques minutes."
        );
        setStatusKind("error");
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        const errorCode = data.error ?? "UNKNOWN";
        setStatus(
          errorCode === "INVALID_EMAIL"
            ? "Email invalide."
            : errorCode === "MISSING_FIELDS"
              ? "Tous les champs sont obligatoires."
              : errorCode === "TOO_LONG"
                ? "Message trop long."
                : "Erreur lors de l'envoi du message."
        );
        setStatusKind("error");
        return;
      }

      setStatus("Message envoyé. Merci, je reviens vers vous rapidement.");
      setStatusKind("success");
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch (error) {
      console.error("[ContactForm] submit failed:", error);
      setStatus("Erreur réseau. Vérifiez votre connexion et réessayez.");
      setStatusKind("error");
    }
  };

  const statusStyles: Record<typeof statusKind, string> = {
    idle: "",
    loading: "bg-surface-container text-on-surface-variant",
    success: "bg-primary-fixed/70 text-on-primary-fixed",
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
      {/* Honeypot : caché visuellement ET aux lecteurs d'écran. tabindex=-1 pour
          qu'un utilisateur clavier ne tombe jamais dessus. Les bots qui
          parsent le DOM le remplissent quasi-systématiquement. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Ne pas remplir ce champ
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

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
          maxLength={120}
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
          maxLength={160}
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
          maxLength={5000}
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
