"use client"

import Link from "next/link"; // Importation du composant Link de Next.js pour la navigation
import { usePathname } from "next/navigation"; // Importation du hook usePathname pour obtenir le chemin actuel

export default function NavLink(props) {
  const pathname = usePathname(); // Obtention du chemin actuel
  const active = pathname === props.path; // Vérification si le lien est actif

  return (
    <Link
      className={active ? "opacity-100" : "opacity-50 hover:opacity-65"} // Classes CSS pour le style du lien
      href={props.path} // Chemin de navigation
    >
      {props.text} {/* Texte du lien */}
    </Link>
  );
}