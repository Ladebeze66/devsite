import Link from "next/link";
import ContactForm from "../components/ContactForm";
import { getApiUrl } from "../utils/getApiUrl";

/**
 * Page contact — étape 8 "Digital Atelier" (voir docs-site-interne/REFONTE-VISUELLE.md §4).
 *
 * Gabarit aligné sur les autres pages de la refonte :
 * - Colonne utile `max-w-3xl` (format lettre, plus intime que les listes `max-w-6xl`).
 * - Hero vellum identique aux pages liste (kicker + titre Manrope + pitch Newsreader).
 * - Tuiles "canaux" imbriquées (`rounded-tile bg-surface-container-low/80`) avec
 *   Material Symbols — LinkedIn / Facebook / Email. LinkedIn et Facebook utilisent
 *   `link` et `public` (pas d'icône Material Symbols dédiée aux marques sociales,
 *   et on veut rester cohérent avec le reste du site en icon-font).
 * - Carte vellum principale pour le formulaire (`rounded-sheet`, `shadow-ambient`,
 *   `backdrop-blur-vellum`) → même empreinte visuelle que le hero home.
 */
const canaux = [
  {
    icon: "link",
    label: "LinkedIn",
    handle: "Fernand Gras-Calvet",
    href: "https://www.linkedin.com/in/fernand-gras-calvet/",
    external: true,
  },
  {
    icon: "public",
    label: "Facebook",
    handle: "Fernand Gras-Calvet",
    href: "https://www.facebook.com/fernand.grascalvet",
    external: true,
  },
  {
    icon: "alternate_email",
    label: "Email",
    handle: "grascalvet.fernand@gmail.com",
    href: "mailto:grascalvet.fernand@gmail.com",
    external: false,
  },
];

export default function ContactPage() {
  const apiUrl = getApiUrl();

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-10 sm:px-6">
      {/* Hero éditorial : kicker + titre + pitch. Gabarit identique aux listes. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="contact-title"
      >
        <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Contact · Prendre la parole
          </span>
          <h1
            id="contact-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl"
          >
            Correspondance
          </h1>
          <p className="font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
            Pour un projet, une question ou une discussion autour de l&apos;IA,
            du développement web ou de l&apos;École 42 — voici les canaux
            ouverts. Le formulaire ci-dessous arrive directement dans mon
            back-office.
          </p>
        </div>
      </section>

      {/* Canaux : 3 tuiles imbriquées, same-tier que les takeaways de la home. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-6"
        aria-labelledby="contact-canaux"
      >
        <div className="mb-4">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Canaux directs
          </span>
          <h2
            id="contact-canaux"
            className="mt-1 font-headline text-xl font-extrabold tracking-tight text-primary md:text-2xl"
          >
            Me joindre ailleurs
          </h2>
        </div>

        <ul className="grid gap-3 md:grid-cols-3">
          {canaux.map((c) => (
            <li key={c.label}>
              <Link
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="group flex h-full items-center gap-3 rounded-tile bg-surface-container-low/80 px-4 py-3 transition-colors hover:bg-surface-container/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    translate="no"
                  >
                    {c.icon}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                    {c.label}
                  </span>
                  <span className="block truncate font-body text-sm text-on-surface">
                    {c.handle}
                  </span>
                </span>
                <span
                  className="material-symbols-outlined text-base text-primary transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                  translate="no"
                >
                  arrow_forward
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulaire : carte vellum principale, le form occupe l'intérieur. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="contact-form-title"
      >
        <div className="mb-5">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Formulaire
          </span>
          <h2
            id="contact-form-title"
            className="mt-1 font-headline text-xl font-extrabold tracking-tight text-primary md:text-2xl"
          >
            Écrire un message
          </h2>
          <p className="mt-1 font-body text-sm italic text-on-surface-variant">
            Les trois champs sont obligatoires. Temps de réponse habituel : 48 h.
          </p>
        </div>

        <ContactForm apiUrl={apiUrl} />
      </section>
    </div>
  );
}
