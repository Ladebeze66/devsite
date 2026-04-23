#!/usr/bin/env python3
"""Génère le vault Obsidian `vault-grasbot/` à partir de `strapi_extraction/docs/`.

Lit les `project-*.md` et `competence-*.md` produits par `generate-docs.js`,
et les réécrit sous forme de notes Obsidian structurées :

- Frontmatter YAML (type, source, domains, tags, linked, related, updated, visibility)
- Wikilinks [[...]] vers les MOCs et notes frères
- Section "Liens" en pied de note

Génère aussi les MOCs (00-MOC/) qui servent de hubs thématiques.

Usage :
    python build-vault.py             # régénère tout le vault
    python build-vault.py --dry-run   # liste sans écrire

Dépendances : stdlib seule. Optionnel : `pypdf` pour convertir le CV PDF
(absent → le PDF est ignoré, conversion manuelle possible après coup).
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Chemins
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "strapi_extraction" / "docs"
VAULT_DIR = ROOT / "vault-grasbot"
PDF_CV = DOCS_DIR / "nouveauCV_grascalvet.pdf"

SUBDIRS = (
    "00-MOC",
    "10-Projets",
    "20-Competences",
    "30-Parcours",
    "40-Glossaire",
    "50-Technique",
)

# ---------------------------------------------------------------------------
# Inférence de domaines / tags à partir de mots-clés.
# Première version volontairement simple : on cherche des sous-chaînes (case-insensitive)
# dans le titre + corps de la note. Affinable au fil de l'enrichissement du vault.
# ---------------------------------------------------------------------------
DOMAIN_KEYWORDS: dict[str, list[str]] = {
    "algorithmique": ["tri", "pile", "algorithm", "complexité", "push_swap", "fractal"],
    "c": ["langage c", "printf", "libft", "get_next_line", "minitalk", "philosopher"],
    "cpp": ["c++", "cpp", "poo", "polymorphisme", "template", "stl"],
    "systeme": ["unix", "signal", "processus", "mutex", "thread", "ipc", "bash"],
    "reseau": ["tcp", "ip", "socket", "irc", "netpractice", "routage"],
    "web": ["next.js", "nextjs", "react", "django", "api rest", "websocket", "strapi"],
    "devops": ["docker", "nginx", "mariadb", "wordpress", "inception", "conteneur"],
    "securite": ["born2beroot", "ssh", "fail2ban", "ufw", "lvm", "cybersécurité"],
    "ia": [
        "llm", "ollama", "ia locale", "intelligence artificielle", "chatbot", "embedding",
        # Spécialisation Data / IA (ft_linear_regression, piscine Python data, etc.)
        "machine learning", "régression", "régression linéaire", "descente de gradient",
        "numpy", "pandas", "scikit-learn", "data science", "dataframe",
    ],
    "graphique": ["minilibx", "raycasting", "cub3d", "fract-ol", "wolfenstein"],
    "3d": ["impression 3d", "3d printing", "prusa", "slicer", "filament"],
    "domotique": ["domotique", "home assistant", "zigbee", "iot"],
    "ecole-42": ["école 42", "42 perpignan", "42 paris", "projet pédagogique"],
}

TAG_KEYWORDS: dict[str, list[str]] = {
    "42-commun": ["libft", "get_next_line", "push_swap", "minitalk", "philosopher"],
    "42-piscine": ["piscine"],
    "42-tronc": ["minishell", "inception", "cub3d", "netpractice"],
    "tri": ["tri", "push_swap"],
    "concurrence": ["thread", "mutex", "philosopher"],
    "docker": ["docker", "inception"],
    "makefile": ["makefile"],
    "data-ia": [
        "ft_linear_regression", "ft-linear-regression",
        "régression linéaire", "descente de gradient",
        "piscine python", "numpy", "pandas", "scikit-learn",
    ],
    "projet-perso": [],  # drapeau manuel (futur)
}

# Aliases par domaine : synonymes / acronymes utilisés par les visiteurs.
# Injectés automatiquement dans les notes du domaine pour booster le retrieval
# (voir llm-api/search.py). Complémentaires aux aliases manuels du frontmatter.
DOMAIN_ALIASES: dict[str, list[str]] = {
    "algorithmique": ["algo", "algorithme", "algorithmes", "complexité"],
    "c": ["langage c", "ansi c", "c 42"],
    "cpp": ["c++", "cpp 42", "poo", "programmation orientée objet"],
    "systeme": ["système", "unix", "linux", "processus", "threads"],
    "reseau": ["réseau", "tcp", "ip", "sockets", "routage"],
    "web": ["développement web", "site web", "frontend", "backend", "full stack"],
    "devops": ["devops", "conteneurs", "ci/cd", "infrastructure"],
    "securite": ["sécurité", "hardening", "cybersécurité", "audit"],
    "ia": ["ia", "intelligence artificielle", "llm", "llms", "modèles de langage",
           "chatbot", "chatbots", "machine learning", "deep learning", "data science",
           "ollama", "agent", "agents", "rag"],
    "graphique": ["rendu", "raycasting", "minilibx", "graphisme", "2d", "game dev"],
    "3d": ["impression 3d", "3d printing", "fdm", "slicer", "prusa"],
    "domotique": ["domotique", "home assistant", "iot", "smart home", "zigbee"],
    "ecole-42": ["42", "école 42", "42 perpignan", "42 paris", "piscine 42", "tronc commun"],
    "parcours": ["parcours", "cv", "profil", "carrière", "reconversion", "trajectoire"],
}


def infer(text: str, catalog: dict[str, list[str]]) -> list[str]:
    """Retourne les clés du catalog dont au moins un mot-clé apparaît dans text."""
    lowered = text.lower()
    return sorted(k for k, keywords in catalog.items() if any(kw in lowered for kw in keywords))


def slug_variants(slug: str, title: str) -> list[str]:
    """Retourne des variantes utiles d'un slug/titre pour les aliases.

    Ex. slug="push-swap", title="push_swap" → ["push swap", "push-swap", "push_swap"]
    """
    variants: set[str] = set()
    for base in (slug, title):
        if not base:
            continue
        b = base.strip()
        variants.add(b.lower())
        variants.add(b.replace("-", " ").lower())
        variants.add(b.replace("_", " ").lower())
        variants.add(b.replace("-", "_").lower())
        variants.add(b.replace("_", "-").lower())
    # Retire les vides et les doublons, trie par longueur décroissante (plus spécifiques d'abord)
    out = sorted((v for v in variants if v), key=lambda s: (-len(s), s))
    return out[:4]


def _order_domains_by_slug(slug: str, domains: list[str]) -> list[str]:
    """Remonte en tête le domaine qui correspond au slug (ou préfixe).
    Ex. slug='ia' + domains=['algorithmique','ecole-42','ia'] → ['ia','algorithmique','ecole-42'].
    """
    s = slug.lower()
    if not domains:
        return []
    exact = [d for d in domains if d.lower() == s]
    rest = [d for d in domains if d.lower() != s]
    return exact + rest


def build_aliases(title: str, slug: str, domains: list[str]) -> list[str]:
    """Génère une liste d'aliases à partir du titre, du slug et des domaines.

    On priorise dans l'ordre : slug-variants > domaine match avec slug > autres domaines.
    Coupe à 12 pour éviter de trop disperser le scoring, en gardant les plus
    spécifiques (slug du domaine d'abord).
    """
    aliases: list[str] = []
    aliases.extend(slug_variants(slug, title))
    ordered_domains = _order_domains_by_slug(slug, domains)
    for d in ordered_domains:
        aliases.extend(DOMAIN_ALIASES.get(d, []))
    # Dé-doublonne tout en préservant l'ordre
    seen: set[str] = set()
    out: list[str] = []
    for a in aliases:
        a_norm = a.lower().strip()
        if a_norm and a_norm not in seen:
            seen.add(a_norm)
            out.append(a)
    return out[:12]


# Courts libellés parlants pour les answers de compétences (plutôt que le titre brut).
# Priorité : slug > premier domaine significatif > fallback sur le titre.
COMPETENCE_SHORT_LABELS: dict[str, str] = {
    "ia": "IA",
    "domotique": "domotique",
    "3d": "impression 3D",
    "web": "développement web",
    "securite": "sécurité",
    "reseau": "réseaux",
    "systeme": "systèmes",
    "devops": "DevOps",
    "graphique": "programmation graphique",
    "cpp": "C++",
    "c": "langage C",
    "algorithmique": "algorithmique",
    "ecole-42": "l'École 42",
}


def _competence_label(title: str, slug: str, domains: list[str]) -> str:
    """Retourne un libellé court et parlant pour une compétence."""
    if slug in COMPETENCE_SHORT_LABELS:
        return COMPETENCE_SHORT_LABELS[slug]
    for d in domains:
        if d in COMPETENCE_SHORT_LABELS and d != "ecole-42":
            return COMPETENCE_SHORT_LABELS[d]
    # Fallback : titre tronqué aux 5 premiers mots
    words = title.split()
    return " ".join(words[:5]).rstrip(".?!")


def build_answers(title: str, type_: str, slug: str = "", domains: list[str] | None = None) -> list[str]:
    """Génère 2-3 questions-types auxquelles cette note répond naturellement."""
    domains = domains or []
    t = title.strip().rstrip(".?!")
    if type_ == "projet":
        return [
            f"Parle-moi de {t}",
            f"Qu'est-ce que {t} ?",
            f"Comment fonctionne {t} ?",
        ]
    if type_ == "competence":
        label = _competence_label(title, slug, domains)
        return [
            f"Quelles sont ses compétences en {label} ?",
            f"A-t-il de l'expérience en {label} ?",
            f"Parle-moi de son expérience en {label}",
        ]
    if type_ == "moc":
        domain_name = t.replace("MOC —", "").replace("MOC -", "").strip()
        return [
            f"Que fait-il en {domain_name} ?",
            f"Quels projets en {domain_name} ?",
        ]
    if type_ == "parcours":
        return [
            f"Quel est son parcours ?",
            f"Que peux-tu me dire sur Fernand ?",
            f"Cherche-t-il une alternance ?",
        ]
    return []


def compute_priority(type_: str, domains: list[str]) -> int:
    """Priorité heuristique : MOCs > compétences > projets emblématiques > autres."""
    if type_ == "parcours":
        return 10
    if type_ == "moc":
        return 7
    if type_ == "competence":
        return 7
    # Projets : boost léger si domaine "ia" (stratégique pour l'alternance visée)
    if type_ == "projet" and "ia" in domains:
        return 6
    return 5


# ---------------------------------------------------------------------------
# Structures
# ---------------------------------------------------------------------------
@dataclass
class Note:
    """Note Obsidian prête à être sérialisée."""

    filename: str           # "push-swap.md"
    title: str              # "push_swap"
    type: str               # "projet" | "competence" | "parcours" | ...
    slug: str
    source: str             # "strapi/projects" ou similaire
    domains: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    aliases: list[str] = field(default_factory=list)
    answers: list[str] = field(default_factory=list)
    priority: int = 5
    linked: list[str] = field(default_factory=list)   # wikilinks (sans les [[ ]])
    related: list[str] = field(default_factory=list)
    extra: dict[str, str] = field(default_factory=dict)  # champs spécifiques (link, etc.)
    body: str = ""

    def serialize(self) -> str:
        """Retourne le contenu complet de la note Obsidian, frontmatter + corps."""
        yaml_lines = ["---"]
        yaml_lines.append(f"title: {self._yaml_str(self.title)}")
        yaml_lines.append(f"slug: {self.slug}")
        yaml_lines.append(f"type: {self.type}")
        yaml_lines.append(f"source: {self.source}")
        yaml_lines.append(f"domains: {self._yaml_list(self.domains)}")
        yaml_lines.append(f"tags: {self._yaml_list(self.tags)}")
        if self.aliases:
            yaml_lines.append("aliases:")
            for alias in self.aliases:
                yaml_lines.append(f"  - {self._yaml_str(alias)}")
        if self.answers:
            yaml_lines.append("answers:")
            for answer in self.answers:
                yaml_lines.append(f"  - {self._yaml_str(answer)}")
        yaml_lines.append(f"priority: {self.priority}")
        yaml_lines.append("linked:")
        for link in self.linked:
            yaml_lines.append(f"  - \"[[{link}]]\"")
        if self.related:
            yaml_lines.append("related:")
            for rel in self.related:
                yaml_lines.append(f"  - \"[[{rel}]]\"")
        for key, val in self.extra.items():
            yaml_lines.append(f"{key}: {self._yaml_str(val)}")
        yaml_lines.append(f"updated: {date.today().isoformat()}")
        yaml_lines.append("visibility: public")
        yaml_lines.append("---")
        yaml_lines.append("")
        return "\n".join(yaml_lines) + self.body

    @staticmethod
    def _yaml_str(value: str) -> str:
        if value is None:
            return '""'
        if any(c in value for c in ":#&*!|>'\"%@`"):
            escaped = value.replace('"', '\\"')
            return f'"{escaped}"'
        return value

    @staticmethod
    def _yaml_list(values: list[str]) -> str:
        if not values:
            return "[]"
        return "[" + ", ".join(values) + "]"


# ---------------------------------------------------------------------------
# Parsing des .md sources
# ---------------------------------------------------------------------------
SLUG_RE = re.compile(r"^\*\*Slug :\*\*\s*`([^`]+)`", re.MULTILINE)
LINK_RE = re.compile(r"^\*\*Lien GitHub :\*\*\s*\[.+?\]\((.+?)\)", re.MULTILINE)
H1_RE = re.compile(r"^# (.+)$", re.MULTILINE)
H2_RE = re.compile(r"^## (.+)$", re.MULTILINE)


def parse_project(filepath: Path) -> Note | None:
    """Transforme un project-*.md en Note projet."""
    raw = filepath.read_text(encoding="utf-8")

    title_match = H1_RE.search(raw)
    slug_match = SLUG_RE.search(raw)
    if not title_match or not slug_match:
        print(f"  ⚠  {filepath.name} : titre ou slug introuvable, ignoré", file=sys.stderr)
        return None

    title = title_match.group(1).strip()
    slug = slug_match.group(1).strip()
    link_match = LINK_RE.search(raw)

    body_start = title_match.end()
    body = raw[body_start:].strip()
    # Retire la section "Informations techniques" dupliquée que le générateur ajoute
    # (on la reconstruit dans le footer).
    body = re.sub(r"\n## Informations techniques\n[\s\S]*$", "", body).strip()

    extra: dict[str, str] = {}
    if link_match:
        extra["link"] = link_match.group(1).strip()

    domains = infer(raw, DOMAIN_KEYWORDS)
    tags = infer(raw, TAG_KEYWORDS)
    if "ecole-42" not in domains:
        domains.append("ecole-42")
        domains.sort()

    linked = ["MOC-Projets", "MOC-Ecole-42"]

    footer = "\n\n---\n\n## Liens\n\n"
    footer += "- [[MOC-Projets]] — vue d'ensemble des projets\n"
    footer += "- [[MOC-Ecole-42]] — contexte pédagogique\n"
    for d in domains:
        if d != "ecole-42":
            footer += f"- [[MOC-{d.capitalize()}]] — domaine *{d}*\n"

    return Note(
        filename=f"{slug}.md",
        title=title,
        type="projet",
        slug=slug,
        source="strapi/projects",
        domains=domains,
        tags=tags,
        aliases=build_aliases(title, slug, domains),
        answers=build_answers(title, "projet", slug, domains),
        priority=compute_priority("projet", domains),
        linked=linked,
        extra=extra,
        body=body + footer,
    )


def parse_competence(filepath: Path) -> Note | None:
    """Transforme un competence-*.md en Note compétence."""
    raw = filepath.read_text(encoding="utf-8")

    title_match = H1_RE.search(raw)
    slug_match = SLUG_RE.search(raw)
    if not title_match or not slug_match:
        print(f"  ⚠  {filepath.name} : titre ou slug introuvable, ignoré", file=sys.stderr)
        return None

    title = title_match.group(1).strip()
    slug = slug_match.group(1).strip()

    body_start = title_match.end()
    body = raw[body_start:].strip()

    domains = infer(raw, DOMAIN_KEYWORDS)
    tags = infer(raw, TAG_KEYWORDS)

    linked = ["MOC-Competences"]

    footer = "\n\n---\n\n## Liens\n\n"
    footer += "- [[MOC-Competences]] — vue d'ensemble des compétences\n"
    for d in domains:
        footer += f"- [[MOC-{d.capitalize()}]] — domaine *{d}*\n"

    return Note(
        filename=f"{slug}.md",
        title=title,
        type="competence",
        slug=slug,
        source="strapi/competences",
        domains=domains,
        tags=tags,
        aliases=build_aliases(title, slug, domains),
        answers=build_answers(title, "competence", slug, domains),
        priority=compute_priority("competence", domains),
        linked=linked,
        body=body + footer,
    )


# ---------------------------------------------------------------------------
# Génération des MOCs
# ---------------------------------------------------------------------------
def build_moc(
    title: str,
    description: str,
    notes: list[Note],
    *,
    moc_slug: str,
    type_filter: str | None = None,
    domain_filter: str | None = None,
) -> Note:
    selected = [
        n for n in notes
        if (type_filter is None or n.type == type_filter)
        and (domain_filter is None or domain_filter in n.domains)
    ]
    selected.sort(key=lambda n: n.title.lower())

    body = f"\n\n{description}\n\n## Notes liées\n\n"
    if not selected:
        body += "*Aucune note pour l'instant.*\n"
    else:
        for n in selected:
            body += f"- [[{n.slug}|{n.title}]]"
            if n.domains:
                body += f" — _{', '.join(n.domains)}_"
            body += "\n"

    moc_domains = [domain_filter] if domain_filter else []
    moc_aliases = build_aliases(title, moc_slug, moc_domains)
    # Un MOC répond bien aux questions "quels projets en X", "domaine Y"
    domain_label = domain_filter or title.replace("MOC —", "").replace("MOC -", "").strip()
    moc_answers = [
        f"Quels projets en {domain_label} ?",
        f"Que fait-il en {domain_label} ?",
    ]
    return Note(
        filename=f"{moc_slug}.md",
        title=title,
        type="moc",
        slug=moc_slug,
        source="vault/generated",
        domains=moc_domains,
        tags=["moc"],
        aliases=moc_aliases,
        answers=moc_answers,
        priority=7,
        linked=[],
        body=body,
    )


def build_mocs(projects: list[Note], competences: list[Note]) -> list[tuple[str, Note]]:
    """Construit la liste des MOCs à écrire. Chaque item = (sous-dossier, Note)."""
    all_notes = projects + competences

    mocs: list[Note] = []
    mocs.append(build_moc(
        "MOC — Projets",
        "Hub des projets de Fernand Gras-Calvet, triés par titre.",
        all_notes,
        moc_slug="MOC-Projets",
        type_filter="projet",
    ))
    mocs.append(build_moc(
        "MOC — Compétences",
        "Hub des domaines de compétences.",
        all_notes,
        moc_slug="MOC-Competences",
        type_filter="competence",
    ))
    mocs.append(build_moc(
        "MOC — École 42",
        "Tout ce qui est rattaché à la formation 42 Perpignan.",
        all_notes,
        moc_slug="MOC-Ecole-42",
        domain_filter="ecole-42",
    ))

    # MOCs par domaine significatif (s'il y a au moins 2 notes).
    domain_counts: dict[str, int] = {}
    for n in all_notes:
        for d in n.domains:
            domain_counts[d] = domain_counts.get(d, 0) + 1
    for d, count in sorted(domain_counts.items()):
        if count < 2 or d == "ecole-42":
            continue
        mocs.append(build_moc(
            f"MOC — {d.capitalize()}",
            f"Notes du domaine *{d}* ({count} au total).",
            all_notes,
            moc_slug=f"MOC-{d.capitalize()}",
            domain_filter=d,
        ))

    mocs.append(build_moc(
        "MOC — Parcours",
        "Parcours atypique de Fernand Gras-Calvet, du CV aux projets.",
        all_notes,
        moc_slug="MOC-Parcours",
        type_filter="parcours",
    ))

    return [("00-MOC", m) for m in mocs]


# ---------------------------------------------------------------------------
# PDF CV → Markdown (optionnel, requiert pypdf)
# ---------------------------------------------------------------------------
def try_build_cv(vault_dir: Path, dry_run: bool = False) -> Note | None:
    if not PDF_CV.exists():
        print(f"  ℹ  PDF CV absent ({PDF_CV}), étape ignorée")
        return None

    try:
        from pypdf import PdfReader
    except ImportError:
        print(
            "  ⚠  `pypdf` non installé — la conversion du CV est ignorée.\n"
            "     Installer : pip install pypdf\n"
            "     Ou fournir une version déjà convertie dans 30-Parcours/"
        )
        return None

    print(f"  🔄 Conversion PDF → MD : {PDF_CV.name}")
    reader = PdfReader(str(PDF_CV))
    pages_text = [page.extract_text() or "" for page in reader.pages]
    raw = "\n\n".join(pages_text).strip()

    body = "\n\n> [!info] Source\n> Extrait automatiquement depuis `nouveauCV_grascalvet.pdf`.\n> Structurer manuellement dans Obsidian si besoin.\n\n"
    body += "## Contenu brut\n\n"
    body += raw + "\n"

    note = Note(
        filename="cv-grascalvet-fernand.md",
        title="CV — Fernand Gras-Calvet",
        type="parcours",
        slug="cv-grascalvet-fernand",
        source="pdf/nouveauCV_grascalvet",
        domains=["ecole-42"],
        tags=["cv", "parcours"],
        linked=["MOC-Parcours"],
        body=body,
    )
    return note


# ---------------------------------------------------------------------------
# Écriture du vault
# ---------------------------------------------------------------------------
_FRONTMATTER_SOURCE_RE = re.compile(r"^---\s*\n(?:.*?\n)*?source:\s*([^\n]+)\n(?:.*?\n)*?---\s*\n", re.DOTALL)


def _existing_source(path: Path) -> str | None:
    """Retourne la valeur `source:` du frontmatter existant, ou None."""
    if not path.exists():
        return None
    try:
        head = path.read_text(encoding="utf-8")[:2000]
    except OSError:
        return None
    m = _FRONTMATTER_SOURCE_RE.match(head)
    if not m:
        return None
    return m.group(1).strip().strip('"').strip("'")


def write_notes(pairs: list[tuple[str, Note]], dry_run: bool) -> None:
    """Écrit chaque note sur disque, sauf celles dont le frontmatter local a
    `source: manual` — dans ce cas on préserve la version curatée humainement.
    """
    skipped = 0
    for subdir, note in pairs:
        target = VAULT_DIR / subdir / note.filename
        existing = _existing_source(target)
        if existing == "manual":
            print(f"  ⏭  {target.relative_to(ROOT)} (source: manual, préservé)")
            skipped += 1
            continue
        if dry_run:
            print(f"  [dry] {target.relative_to(ROOT)}")
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(note.serialize(), encoding="utf-8")
    if skipped:
        print(f"  ℹ  {skipped} note(s) préservée(s) (source: manual).")


def write_readme(projects: list[Note], competences: list[Note], dry_run: bool) -> None:
    readme = f"""# Vault GrasBot — Base de connaissances

Vault Obsidian généré par `strapi_extraction/build-vault.py` à partir des
contenus Strapi du site (projets + compétences) et du CV PDF. Alimente
directement le pipeline de recherche de GrasBot (`llm-api/search.py`) :
graph + BM25, sans embeddings.

**Dernière génération :** {date.today().isoformat()}

## Structure

- `00-MOC/` — Maps of Content (hubs thématiques)
- `10-Projets/` — {len(projects)} projets extraits de Strapi
- `20-Competences/` — {len(competences)} compétences extraites de Strapi
- `30-Parcours/` — Parcours personnel, CV, bio (version curatée `source: manual`)
- `40-Glossaire/` — Termes techniques (vide, à remplir manuellement ou depuis Strapi plus tard)
- `50-Technique/` — Auto-documentation (architecture, retrieval, vault)
- `TAXONOMIE.md` — Vocabulaire contrôlé (domaines, tags, aliases, answers, priority)

## Conventions

Chaque note porte un frontmatter YAML enrichi :

```yaml
---
title: ...
slug: ...
type: projet | competence | parcours | glossaire | moc | technique
source: strapi/... | pdf/... | manual | vault/generated
domains: [ia, web, systeme, ...]       # taxonomie contrôlée
tags: [tag-1, tag-2]
aliases:                                # synonymes pour le retrieval
  - "alias court"
  - "autre formulation"
answers:                                # questions-types auxquelles répond la note
  - "Question formulée naturellement ?"
priority: 5                             # 1..10, boost léger au scoring
linked: ["[[MOC-...]]"]                 # voisins du graphe (sortants)
related: ["[[autre-note]]"]
updated: YYYY-MM-DD
visibility: public | private            # `private` exclu du retrieval
---
```

Voir `TAXONOMIE.md` pour le vocabulaire contrôlé des domaines/tags et les
règles de rédaction des aliases/answers.

**Règle de régénération** : le script `build-vault.py` **écrase** sans prévenir
les notes dont le frontmatter a `source: strapi/*` ou `source: pdf/*`. Il ne
touche **jamais** aux notes `source: manual` que tu ajoutes toi-même. Les
aliases, answers et priority des notes générées sont calculés automatiquement
à partir du titre, du slug et des domaines ; les notes stratégiques méritent
un enrichissement manuel en passant `source: manual`.

## Fusion avec un vault personnel

Pour agrémenter ce vault avec ton vault Obsidian perso :

1. Copier `vault-grasbot/` dans ton vault existant comme sous-dossier, ou
2. Ouvrir `vault-grasbot/` comme vault séparé dans Obsidian (plus simple pour démarrer).

Les wikilinks `[[nom]]` restent valides tant que les noms de notes sont uniques
dans le vault courant. Les notes `source: manual` que tu crées ne seront jamais
écrasées par une régénération. Pour une note privée qui ne doit pas apparaître
côté chatbot, ajouter `visibility: private` : elle sera exclue de `load_vault()`.
"""
    target = VAULT_DIR / "README.md"
    if dry_run:
        print(f"  [dry] {target.relative_to(ROOT)}")
        return
    target.write_text(readme, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="N'écrit rien, affiche juste ce qui serait fait.")
    parser.add_argument("--clean", action="store_true", help="Supprime le vault avant de le régénérer (les notes manuelles seront perdues !).")
    args = parser.parse_args()

    print(f"🏗  Vault → {VAULT_DIR.relative_to(ROOT)}")
    if args.clean and VAULT_DIR.exists() and not args.dry_run:
        print(f"  🧹 Suppression du vault existant (--clean)")
        shutil.rmtree(VAULT_DIR)

    if not args.dry_run:
        for subdir in SUBDIRS:
            (VAULT_DIR / subdir).mkdir(parents=True, exist_ok=True)

    # Parsing
    print("\n📦 Parsing des projets…")
    project_notes = []
    for fp in sorted(DOCS_DIR.glob("project-*.md")):
        note = parse_project(fp)
        if note:
            project_notes.append(note)
            print(f"  ✓ {note.slug}")

    print(f"\n📦 Parsing des compétences…")
    competence_notes = []
    for fp in sorted(DOCS_DIR.glob("competence-*.md")):
        note = parse_competence(fp)
        if note:
            competence_notes.append(note)
            print(f"  ✓ {note.slug}")

    # Related : pour chaque note, trouve les 3 notes les plus similaires (intersection domains)
    print("\n🔗 Calcul des notes connexes…")
    for note in project_notes + competence_notes:
        note.related = _find_related(note, project_notes + competence_notes, limit=3)
        # Réinjecte les related dans le footer : on réécrit la section Liens.
        # (Le footer est déjà inclus dans note.body — on le laisse tel quel, les
        # wikilinks related apparaîtront via le frontmatter. Simplicité >.)

    # MOCs
    print("\n🗺  Génération des MOCs…")
    moc_pairs = build_mocs(project_notes, competence_notes)
    for _, m in moc_pairs:
        print(f"  ✓ {m.slug}")

    # Assemble l'ensemble à écrire
    pairs: list[tuple[str, Note]] = []
    pairs += [("10-Projets", n) for n in project_notes]
    pairs += [("20-Competences", n) for n in competence_notes]
    pairs += moc_pairs

    # PDF CV
    print("\n📄 CV PDF…")
    cv_note = try_build_cv(VAULT_DIR, dry_run=args.dry_run)
    if cv_note:
        pairs.append(("30-Parcours", cv_note))

    # Écriture
    print(f"\n✍  Écriture ({len(pairs)} notes)…")
    write_notes(pairs, dry_run=args.dry_run)
    write_readme(project_notes, competence_notes, dry_run=args.dry_run)

    print(f"\n🎯 Terminé — {len(project_notes)} projets, {len(competence_notes)} compétences, {len(moc_pairs)} MOCs" + (", 1 CV" if cv_note else ""))
    print(f"📁 {VAULT_DIR.relative_to(ROOT)}")
    return 0


def _find_related(note: Note, all_notes: list[Note], limit: int = 3) -> list[str]:
    """Ordre simple : notes qui partagent le plus de domains avec `note`."""
    scored: list[tuple[int, Note]] = []
    for other in all_notes:
        if other.slug == note.slug:
            continue
        shared = len(set(note.domains) & set(other.domains))
        if shared >= 1:
            scored.append((shared, other))
    scored.sort(key=lambda x: (-x[0], x[1].title.lower()))
    return [n.slug for _, n in scored[:limit]]


if __name__ == "__main__":
    sys.exit(main())
