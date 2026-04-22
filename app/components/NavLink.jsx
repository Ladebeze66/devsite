"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavLink — lien de navigation avec état actif.
 *
 * Props :
 *  - text (string) : libellé affiché.
 *  - path (string) : URL cible.
 *  - onClick (fn, optionnel)  : handler (ex. fermeture du drawer mobile).
 *  - className (string, optionnel) : classes utilitaires communes (fond, padding…).
 *  - activeClassName (string, optionnel) : classes appliquées quand la route courante == path.
 *  - inactiveClassName (string, optionnel) : classes appliquées quand la route courante != path.
 *
 * Sans activeClassName / inactiveClassName, on retombe sur le comportement
 * historique `opacity-100 / opacity-50 hover:opacity-65` pour ne rien casser
 * sur les NavLink du header desktop qui n'en fournissent pas.
 */
export default function NavLink(props) {
  const {
    text,
    path,
    onClick,
    className = "",
    activeClassName,
    inactiveClassName,
  } = props;

  const pathname = usePathname();
  const active = pathname === path;

  const stateClass = active
    ? activeClassName ?? "opacity-100"
    : inactiveClassName ?? "opacity-50 hover:opacity-65";

  return (
    <Link
      className={`${className} ${stateClass}`.trim()}
      href={path}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
