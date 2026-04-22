"""Pipeline de recherche GrasBot — graph + BM25, sans embeddings (2026-04-22).

Remplace l'ancien `rag.py` (ChromaDB + embeddings Ollama). Rationnel :

- Vault de taille modeste (~36 notes, ~50-100 Ko) : la recherche sémantique
  vectorielle est sur-dimensionnée et imprévisible sur vocabulaire précis.
- Le vault est déjà **structuré** (frontmatter YAML, wikilinks, MOCs) : on
  exploite directement cette structure comme un graphe de connaissance.
- Résultat : retrieval **déterministe**, **traçable**, instantané (~50 ms),
  sans Chroma, sans compilation C++, sans `nomic-embed-text` chargé en VRAM.

Pipeline :

1. `load_vault()` : parcours récursif de `vault-grasbot/`, parsing YAML +
   body, extraction des wikilinks. Mémoïsé (chargé une fois par process).
2. `search(query, top_k)` : score chaque note (alias/title/slug/answers/
   domains/tags + BM25 sur le body), expansion par graphe (voisins via
   `linked`, `related`, wikilinks du body), dédoublonnage, top_k.
3. `build_prompt(query, notes)` : assemble (system, user) avec notes entières.
4. `generate(system, user)` : appel Ollama `/api/chat` (Qwen3 par défaut).
5. `answer(query)` : façade haut-niveau consommée par `api.py`.

Variables d'environnement (toutes optionnelles) :

- `OLLAMA_URL`        (default: http://localhost:11434)
- `LLM_MODEL`         (default: qwen3:8b)
- `VAULT_DIR`         (default: <repo_root>/vault-grasbot)
- `SEARCH_TOP_K`      (default: 5)
- `SEARCH_MIN_SCORE`  (default: 1.0) — seuil en-dessous duquel on considère
                     qu'aucune note pertinente n'a été trouvée.
"""

from __future__ import annotations

import math
import os
import re
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

import requests
import yaml

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
LLM_MODEL = os.environ.get("LLM_MODEL", "qwen3:8b")

_DEFAULT_VAULT = (Path(__file__).resolve().parent.parent / "vault-grasbot").as_posix()
VAULT_DIR = Path(os.environ.get("VAULT_DIR", _DEFAULT_VAULT))

TOP_K = int(os.environ.get("SEARCH_TOP_K", "5"))
MIN_SCORE = float(os.environ.get("SEARCH_MIN_SCORE", "1.0"))

# ---------------------------------------------------------------------------
# Tokenisation FR (stop-words minimalistes, suffisants pour 36 notes)
# ---------------------------------------------------------------------------
_FR_STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "au", "aux",
    "l", "et", "ou", "ni", "mais", "donc", "or", "car", "que", "qui",
    "quoi", "dont", "ou", "où", "si", "en", "y", "à", "a", "sur", "sous",
    "dans", "par", "pour", "avec", "sans", "vers", "chez", "entre",
    "est", "sont", "été", "être", "avoir", "il", "elle", "ils", "elles",
    "on", "nous", "vous", "je", "tu", "me", "te", "se", "moi", "toi",
    "son", "sa", "ses", "ma", "mon", "mes", "ta", "ton", "tes",
    "notre", "nos", "votre", "vos", "leur", "leurs",
    "ce", "cet", "cette", "ces", "cela", "ça", "celui", "celle",
    "ceci", "celles", "ceux", "tout", "tous", "toute", "toutes",
    "pas", "ne", "n", "plus", "moins", "très", "bien", "mal",
    "peux", "peut", "peuvent", "pouvoir", "fait", "faire", "dit", "dire",
    "quel", "quelle", "quels", "quelles", "comment", "pourquoi", "quand",
    "parle", "parles", "parlez", "parler",
    "moi", "toi", "lui", "eux",
}

_TOKEN_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ0-9+#.]+", re.UNICODE)

# Normalisations courantes pour que `c++`, `C#`, `push-swap`, `push_swap`
# tombent tous sur les mêmes tokens que le vault.
_NORMALIZE = {
    "c++": "cpp",
    "c#": "csharp",
}


def tokenize_fr(text: str) -> list[str]:
    """Tokenisation minimale avec normalisations :
    - minuscules
    - `-` et `_` éclatés en espaces (ex. `push-swap` → `push swap`)
    - `c++` → `cpp`, `c#` → `csharp`
    - stop-words FR retirés, tokens de 1 caractère écartés
    """
    if not text:
        return []
    # Éclate les slugs/identifiants composés
    cleaned = text.lower().replace("-", " ").replace("_", " ")
    words = _TOKEN_RE.findall(cleaned)
    out: list[str] = []
    for w in words:
        w = _NORMALIZE.get(w, w)
        if w in _FR_STOPWORDS or len(w) <= 1:
            continue
        out.append(w)
    return out


# ---------------------------------------------------------------------------
# Structure d'une note
# ---------------------------------------------------------------------------
@dataclass
class Note:
    """Note Obsidian chargée en mémoire, prête à être scorée."""

    slug: str
    title: str
    type: str                     # projet | competence | moc | parcours | technique
    path: Path
    body: str
    body_tokens: list[str]
    # Frontmatter structurant
    source: str = ""
    visibility: str = "public"
    domains: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    aliases: list[str] = field(default_factory=list)
    answers: list[str] = field(default_factory=list)
    priority: int = 5             # 1 (rarement pertinent) à 10 (toujours à remonter)
    # Graphe
    linked: list[str] = field(default_factory=list)   # slugs
    related: list[str] = field(default_factory=list)  # slugs
    wikilinks: list[str] = field(default_factory=list)  # slugs mentionnés dans le body
    # Utile côté UI
    extra: dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Parsing du vault
# ---------------------------------------------------------------------------
_WIKILINK_RE = re.compile(r"\[\[([^\[\]|]+?)(?:\|[^\]]*?)?\]\]")
_YAML_WIKILINK_RE = re.compile(r'"\[\[([^\[\]|"]+?)(?:\|[^\]"]*?)?\]\]"')


def _extract_slugs_from_list(value: Any) -> list[str]:
    """Extrait des slugs depuis une liste YAML pouvant contenir '[[slug]]'."""
    if not value:
        return []
    if isinstance(value, str):
        value = [value]
    if not isinstance(value, list):
        return []
    slugs: list[str] = []
    for item in value:
        if not isinstance(item, str):
            continue
        m = re.match(r"\[\[([^\[\]|]+?)(?:\|[^\]]*?)?\]\]", item.strip())
        if m:
            slugs.append(m.group(1).strip())
        elif item.strip():
            slugs.append(item.strip())
    return slugs


def _extract_wikilinks_from_body(body: str) -> list[str]:
    """Retourne les slugs mentionnés via [[slug]] ou [[slug|alias]] dans le body."""
    return sorted({m.group(1).strip() for m in _WIKILINK_RE.finditer(body)})


_FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)


def parse_note(path: Path) -> Note | None:
    """Parse une note Markdown avec frontmatter YAML. Retourne None si illisible."""
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"⚠  parse_note: {path} illisible ({exc})")
        return None

    m = _FRONTMATTER_RE.match(raw)
    if not m:
        # Note sans frontmatter (rare) : on l'accepte quand même avec défauts.
        fm: dict[str, Any] = {}
        body = raw.strip()
    else:
        fm_text, body = m.group(1), m.group(2).strip()
        try:
            fm = yaml.safe_load(fm_text) or {}
        except yaml.YAMLError as exc:
            print(f"⚠  parse_note: frontmatter invalide dans {path.name} ({exc})")
            fm = {}

    slug = str(fm.get("slug") or path.stem).strip()
    title = str(fm.get("title") or slug).strip()
    type_ = str(fm.get("type") or "note").strip()

    domains = [str(d).strip() for d in (fm.get("domains") or []) if str(d).strip()]
    tags = [str(t).strip() for t in (fm.get("tags") or []) if str(t).strip()]
    aliases = [str(a).strip() for a in (fm.get("aliases") or []) if str(a).strip()]
    answers = [str(a).strip() for a in (fm.get("answers") or []) if str(a).strip()]

    linked = _extract_slugs_from_list(fm.get("linked"))
    related = _extract_slugs_from_list(fm.get("related"))
    wikilinks = _extract_wikilinks_from_body(body)

    try:
        priority = int(fm.get("priority", 5))
    except (TypeError, ValueError):
        priority = 5

    extra: dict[str, Any] = {}
    for key in ("link", "updated"):
        if key in fm and fm[key] is not None:
            extra[key] = fm[key]

    return Note(
        slug=slug,
        title=title,
        type=type_,
        path=path,
        body=body,
        body_tokens=tokenize_fr(body),
        source=str(fm.get("source") or ""),
        visibility=str(fm.get("visibility") or "public"),
        domains=domains,
        tags=tags,
        aliases=aliases,
        answers=answers,
        priority=priority,
        linked=linked,
        related=related,
        wikilinks=wikilinks,
        extra=extra,
    )


@lru_cache(maxsize=1)
def load_vault() -> dict[str, Note]:
    """Charge toutes les notes `.md` du vault en mémoire (mémoïsé).

    Retourne un dict {slug: Note}. Les notes invisibles (`visibility: private`)
    sont **exclues** pour que le chatbot ne puisse jamais les surfaces.
    """
    if not VAULT_DIR.exists():
        print(f"⚠  load_vault: {VAULT_DIR} introuvable")
        return {}

    vault: dict[str, Note] = {}
    for md_path in sorted(VAULT_DIR.rglob("*.md")):
        if md_path.name == "README.md" or md_path.name == "TAXONOMIE.md":
            # Méta-docs du vault, pas de contenu à surfacer au chatbot.
            continue
        note = parse_note(md_path)
        if note is None:
            continue
        if note.visibility != "public":
            continue
        if note.slug in vault:
            print(f"⚠  load_vault: slug dupliqué '{note.slug}' ({md_path.name})")
        vault[note.slug] = note

    print(f"📚 Vault chargé : {len(vault)} notes ({VAULT_DIR})")
    return vault


def reload_vault() -> dict[str, Note]:
    """Force la relecture du vault (utile après édition sans redémarrer l'API)."""
    load_vault.cache_clear()
    return load_vault()


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------
def _contains_any(haystack: str, needles: list[str]) -> bool:
    """True si au moins un `needle` apparaît dans `haystack` (insensible à la casse)."""
    if not needles:
        return False
    lower = haystack.lower()
    return any(n.lower() in lower for n in needles if n)


def _token_overlap(tokens_a: list[str], tokens_b: list[str]) -> int:
    """Nombre de tokens communs (intersection simple)."""
    if not tokens_a or not tokens_b:
        return 0
    return len(set(tokens_a) & set(tokens_b))


def _bm25_score(query_tokens: list[str], note: Note, corpus_stats: dict[str, Any]) -> float:
    """Score BM25 simplifié sur le body. Normalisé [0, ~5]."""
    if not query_tokens or not note.body_tokens:
        return 0.0
    k1 = 1.5
    b = 0.75
    avgdl = corpus_stats["avgdl"]
    N = corpus_stats["N"]
    idf = corpus_stats["idf"]
    doc_len = len(note.body_tokens)
    tf_counts: dict[str, int] = {}
    for tok in note.body_tokens:
        tf_counts[tok] = tf_counts.get(tok, 0) + 1

    score = 0.0
    for q in query_tokens:
        if q not in tf_counts:
            continue
        f = tf_counts[q]
        denom = f + k1 * (1 - b + b * doc_len / avgdl) if avgdl else f
        if denom == 0:
            continue
        score += idf.get(q, 0.0) * (f * (k1 + 1)) / denom

    # Normalisation empirique : BM25 sur body court donne des valeurs 0-15,
    # on écrase à [0, 5] pour rester comparable aux boosts exacts.
    return min(score / 3.0, 5.0)


@lru_cache(maxsize=1)
def _corpus_stats() -> dict[str, Any]:
    """Pré-calcule les stats BM25 globales (IDF, avgdl) une fois."""
    vault = load_vault()
    N = len(vault) or 1
    total_len = 0
    df: dict[str, int] = {}
    for note in vault.values():
        total_len += len(note.body_tokens)
        for tok in set(note.body_tokens):
            df[tok] = df.get(tok, 0) + 1
    avgdl = total_len / N if N else 1
    idf = {
        tok: math.log((N - d + 0.5) / (d + 0.5) + 1.0)
        for tok, d in df.items()
    }
    return {"N": N, "avgdl": avgdl, "idf": idf}


@dataclass
class ScoredNote:
    note: Note
    score: float
    reasons: list[str] = field(default_factory=list)


def _alias_matches(aliases: list[str], query_tokens: set[str], query_lower: str) -> list[str]:
    """Un alias matche si :
    - il est composé de >=2 tokens ET apparaît en substring (ex. "home assistant")
    - OU il est un token unique ET ce token apparaît dans les query_tokens.
    """
    hits: list[str] = []
    for alias in aliases:
        if not alias:
            continue
        al = alias.strip().lower()
        al_tokens = tokenize_fr(al)
        if len(al_tokens) >= 2:
            if al in query_lower:
                hits.append(alias)
        elif al_tokens:
            if al_tokens[0] in query_tokens:
                hits.append(alias)
        elif al in query_lower:
            hits.append(alias)
    return hits


def _keyword_matches(keywords: list[str], query_tokens: set[str]) -> list[str]:
    """Match strict par token : évite que 'c' matche 'recette'."""
    if not keywords:
        return []
    kw_lower = {k.lower() for k in keywords if k}
    return sorted(kw_lower & query_tokens)


def score_note(note: Note, query: str, query_tokens: list[str],
               stats: dict[str, Any]) -> ScoredNote:
    """Score une note selon plusieurs signaux, retourne (score, reasons)."""
    score = 0.0
    reasons: list[str] = []

    query_lower = query.lower()
    query_token_set = set(query_tokens)
    title_tokens = tokenize_fr(note.title)

    # 1. Match d'alias : signal très fort (synonymes explicites)
    alias_hits = _alias_matches(note.aliases, query_token_set, query_lower)
    if alias_hits:
        score += 10.0
        reasons.append(f"alias:{','.join(alias_hits[:2])}")

    # 2. Match titre / slug (stricts par tokens, pas substring)
    if note.title.lower() in query_lower and len(note.title) >= 4:
        score += 8.0
        reasons.append("title")
    elif _token_overlap(title_tokens, query_tokens) >= 2:
        score += 4.0
        reasons.append("title-tokens")
    slug_tokens = tokenize_fr(note.slug.replace("-", " ").replace("_", " "))
    if slug_tokens and all(t in query_token_set for t in slug_tokens):
        score += 8.0
        reasons.append("slug")

    # 3. Questions-type : si la requête ressemble à une question-réponse prévue
    for ans in note.answers:
        if ans:
            overlap = _token_overlap(tokenize_fr(ans), query_tokens)
            if overlap >= 3:
                score += 12.0
                reasons.append("answers")
                break
            elif overlap >= 2:
                score += 5.0
                reasons.append("answers-partial")
                break

    # 4. Domaines et tags : match STRICT par token pour éviter les faux positifs
    domain_hits = _keyword_matches(note.domains, query_token_set)
    if domain_hits:
        score += 5.0 * len(domain_hits)
        reasons.append(f"domains:{','.join(domain_hits)}")
    tag_hits = _keyword_matches(note.tags, query_token_set)
    if tag_hits:
        score += 3.0 * len(tag_hits)
        reasons.append(f"tags:{','.join(tag_hits)}")

    # 4. BM25 sur le body
    bm25 = _bm25_score(query_tokens, note, stats)
    if bm25 > 0:
        score += bm25
        reasons.append(f"bm25:{bm25:.2f}")

    # À ce stade, `score` reflète uniquement des **signaux textuels** (alias,
    # titre, slug, answers, domaines, tags, BM25). Les boosts ci-dessous
    # (priorité, moc-hub) ne s'appliquent que si l'on a au moins un vrai
    # signal — sinon une note MOC au repos bouffererait tout le top à 1.6.
    if score > 0:
        if note.priority > 5:
            score += (note.priority - 5) * 0.3
            reasons.append(f"priority:{note.priority}")
        if note.type == "moc":
            score += 1.0
            reasons.append("moc-hub")

    return ScoredNote(note=note, score=score, reasons=reasons)


# ---------------------------------------------------------------------------
# Expansion par graphe
# ---------------------------------------------------------------------------
def expand_by_graph(seed: list[ScoredNote], vault: dict[str, Note],
                    max_extra: int = 3) -> list[ScoredNote]:
    """Ajoute les voisins directs (linked + related + wikilinks) des seeds.

    Chaque voisin récupère un score dérivé de son parent (70 %) + éventuellement
    boosté s'il est déjà présent dans plusieurs seeds.
    """
    if not seed:
        return []

    result: dict[str, ScoredNote] = {s.note.slug: s for s in seed}

    for parent in seed:
        neighbors = set(parent.note.linked + parent.note.related + parent.note.wikilinks)
        for slug in neighbors:
            neighbor = vault.get(slug)
            if neighbor is None:
                continue
            derived = parent.score * 0.6
            if slug in result:
                # Renforcement : voisin mentionné par plusieurs seeds = plus pertinent
                result[slug].score += derived * 0.3
                if "graph-reinforce" not in result[slug].reasons:
                    result[slug].reasons.append("graph-reinforce")
            else:
                result[slug] = ScoredNote(
                    note=neighbor,
                    score=derived,
                    reasons=[f"graph-from:{parent.note.slug}"],
                )

    # Limite le total de voisins ajoutés pour ne pas noyer le contexte
    extras = [s for s in result.values() if s.note.slug not in {x.note.slug for x in seed}]
    extras.sort(key=lambda x: -x.score)
    return seed + extras[:max_extra]


# ---------------------------------------------------------------------------
# API haut-niveau : search
# ---------------------------------------------------------------------------
def search(query: str, top_k: int | None = None) -> list[ScoredNote]:
    """Retourne la liste des notes pertinentes pour `query`, triée par score."""
    top_k = top_k or TOP_K
    vault = load_vault()
    if not vault:
        return []

    stats = _corpus_stats()
    query_tokens = tokenize_fr(query)

    scored = [score_note(note, query, query_tokens, stats) for note in vault.values()]
    scored = [s for s in scored if s.score > 0]
    scored.sort(key=lambda x: -x.score)

    # Top-N brut avant expansion (garde 3 seeds pour expansion graphe)
    seeds = scored[:3]
    expanded = expand_by_graph(seeds, vault, max_extra=top_k - len(seeds))
    expanded.sort(key=lambda x: -x.score)
    return expanded[:top_k]


# ---------------------------------------------------------------------------
# Prompt building
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """Tu es GrasBot, l'assistant IA du portfolio de Fernand Gras-Calvet, étudiant à l'École 42 Perpignan.

Ton rôle :
- Répondre aux visiteurs du site sur le parcours, les projets, les compétences de Fernand.
- T'appuyer sur les notes du vault personnel fournies dans le contexte.

Règles :
- Réponds en français, ton sobre et précis, sans emojis.
- Cite tes sources entre crochets carrés en utilisant le slug (ex. [push-swap], [ia]).
- Si l'information n'apparaît pas dans les notes fournies, dis-le honnêtement et oriente vers le site (/portfolio, /competences, /contact) sans inventer.
- Reste concis (3 à 6 phrases en général), sauf demande explicite de détail.
- Si la question est hors sujet (ex. question généraliste sans rapport avec Fernand), indique poliment ton rôle et invite à poser une question sur son parcours."""


def build_prompt(query: str, scored_notes: list[ScoredNote]) -> tuple[str, str]:
    """Assemble (system, user) pour Qwen3. Notes **entières** dans le contexte."""
    # Seuil : si toutes les notes sont en-dessous, on considère "pas de contexte pertinent"
    relevant = [s for s in scored_notes if s.score >= MIN_SCORE]

    if relevant:
        context_blocks = []
        for i, s in enumerate(relevant, 1):
            n = s.note
            header = f"[SOURCE {i} · slug={n.slug} · type={n.type} · score={s.score:.1f}] {n.title}"
            context_blocks.append(f"{header}\n{n.body}")
        context = "\n\n---\n\n".join(context_blocks)
        user = (
            "Voici les notes pertinentes du vault personnel de Fernand :\n\n"
            f"{context}\n\n"
            "---\n\n"
            f"Question du visiteur : {query}\n\n"
            "Réponds en t'appuyant sur ces notes. Si la question dépasse leur portée, dis-le."
        )
    else:
        user = (
            f"Question du visiteur : {query}\n\n"
            "Note : aucune fiche du vault ne correspond clairement à cette question. "
            "Réponds sobrement à partir de tes connaissances générales, "
            "sans inventer de faits spécifiques sur Fernand. "
            "Invite le visiteur à explorer /portfolio, /competences, /contact."
        )

    return SYSTEM_PROMPT, user


# ---------------------------------------------------------------------------
# Génération via Ollama
# ---------------------------------------------------------------------------
def generate(system: str, user: str) -> str:
    """Appelle Ollama `/api/chat` et renvoie le texte de réponse."""
    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "stream": False,
            "options": {
                "temperature": 0.4,
                "num_predict": 512,
            },
            "keep_alive": "30m",
        },
        timeout=180,
    )
    response.raise_for_status()
    data = response.json()
    message = data.get("message") or {}
    content = message.get("content", "").strip()
    if not content:
        raise RuntimeError(
            f"generate: réponse vide du modèle '{LLM_MODEL}' — vérifier qu'il est pullé."
        )
    return content


# ---------------------------------------------------------------------------
# Façade haut-niveau
# ---------------------------------------------------------------------------
def answer(query: str, top_k: int | None = None) -> dict[str, Any]:
    """Entrée principale consommée par `api.py`.

    Retourne :
    {
      "response": str,                 # texte LLM (consommé par askAI.js → ChatBot.js)
      "sources": list[{slug, title, type, score, reasons, url?}],
      "model": str,
      "grounded": bool,                # True si au moins 1 note a dépassé MIN_SCORE
      "vault_size": int,
    }
    """
    scored = search(query, top_k=top_k)
    system, user = build_prompt(query, scored)
    text = generate(system, user)

    sources = []
    for s in scored:
        url = None
        if s.note.type == "projet":
            url = f"/portfolio/{s.note.slug}"
        elif s.note.type == "competence":
            url = f"/competences/{s.note.slug}"
        sources.append({
            "slug": s.note.slug,
            "title": s.note.title,
            "type": s.note.type,
            "score": round(s.score, 2),
            "reasons": s.reasons,
            **({"url": url} if url else {}),
        })

    grounded = any(s.score >= MIN_SCORE for s in scored)

    return {
        "response": text,
        "sources": sources,
        "model": LLM_MODEL,
        "grounded": grounded,
        "vault_size": len(load_vault()),
    }
