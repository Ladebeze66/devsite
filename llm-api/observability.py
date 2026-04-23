"""Observabilité GrasBot via Langfuse — init client + helpers de tracing.

Conçu pour être **optionnel** : si les variables d'environnement Langfuse ne sont pas
définies, le module expose un client *no-op* (dummy) qui ignore silencieusement tous
les appels. Ainsi l'API FastAPI reste fonctionnelle même sans instance Langfuse, et
les dev qui clonent le repo n'ont rien à configurer pour tester `/ask` localement.

Chargement des variables d'environnement :
1. On appelle `load_dotenv()` qui lit `llm-api/.env` s'il existe.
2. On lit `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, et l'URL (priorité à
   `LANGFUSE_BASE_URL` — c'est ce que l'UI Langfuse recopie dans ses snippets —
   puis fallback sur `LANGFUSE_HOST` pour compatibilité avec le SDK standard).
3. Si les 3 sont présentes → vrai client Langfuse. Sinon → no-op.

Voir `docs-site-interne/langfuse-observability.md` pour l'architecture et ce qu'on trace.
"""
from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from dotenv import load_dotenv

# --------------------------------------------------------------------------
# 1. Chargement du .env local (à côté de ce fichier, donc llm-api/.env)
# --------------------------------------------------------------------------
_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(_ENV_PATH)


# --------------------------------------------------------------------------
# 2. Client no-op (fallback si Langfuse n'est pas configuré)
# --------------------------------------------------------------------------
class _NullSpan:
    """Remplace un span Langfuse quand l'instrumentation est désactivée."""

    def update(self, **kwargs: Any) -> None:  # noqa: D401
        """No-op."""

    def update_trace(self, **kwargs: Any) -> None:  # noqa: D401
        """No-op."""

    def score(self, **kwargs: Any) -> None:  # noqa: D401
        """No-op."""

    def end(self, **kwargs: Any) -> None:  # noqa: D401
        """No-op."""

    def __enter__(self) -> "_NullSpan":
        return self

    def __exit__(self, *exc: Any) -> None:
        return None


class _NullLangfuse:
    """Client Langfuse factice : toutes les méthodes sont des no-op."""

    enabled = False

    @contextmanager
    def start_as_current_span(self, *args: Any, **kwargs: Any) -> Iterator[_NullSpan]:
        yield _NullSpan()

    @contextmanager
    def start_as_current_observation(self, *args: Any, **kwargs: Any) -> Iterator[_NullSpan]:
        yield _NullSpan()

    def update_current_trace(self, **kwargs: Any) -> None:
        pass

    def update_current_span(self, **kwargs: Any) -> None:
        pass

    def score_current_trace(self, **kwargs: Any) -> None:
        pass

    def score_current_observation(self, **kwargs: Any) -> None:
        pass

    def flush(self) -> None:
        pass


# --------------------------------------------------------------------------
# 3. Résolution de l'URL + construction du client
# --------------------------------------------------------------------------
def _resolve_host() -> str | None:
    """Priorité LANGFUSE_BASE_URL → LANGFUSE_HOST (compat SDK)."""
    return os.environ.get("LANGFUSE_BASE_URL") or os.environ.get("LANGFUSE_HOST")


def _build_client() -> Any:
    """Tente de construire le vrai client Langfuse. Retourne _NullLangfuse en cas d'échec."""
    public_key = os.environ.get("LANGFUSE_PUBLIC_KEY")
    secret_key = os.environ.get("LANGFUSE_SECRET_KEY")
    host = _resolve_host()

    if not (public_key and secret_key and host):
        missing = [
            name
            for name, value in (
                ("LANGFUSE_PUBLIC_KEY", public_key),
                ("LANGFUSE_SECRET_KEY", secret_key),
                ("LANGFUSE_BASE_URL/HOST", host),
            )
            if not value
        ]
        print(
            f"ℹ️  Langfuse désactivé — variables manquantes : {', '.join(missing)}. "
            "L'API fonctionne normalement, aucun trace ne sera envoyée."
        )
        return _NullLangfuse()

    try:
        from langfuse import Langfuse

        client = Langfuse(
            public_key=public_key,
            secret_key=secret_key,
            host=host,
        )
        print(f"✅  Langfuse initialisé (host={host})")
        return client
    except Exception as exc:  # pragma: no cover — défensif
        print(
            f"⚠️  Langfuse init failed ({exc.__class__.__name__}: {exc}). "
            "L'API continue de fonctionner sans observabilité."
        )
        return _NullLangfuse()


# Singleton : un seul client pour toute la durée du process.
langfuse = _build_client()


# --------------------------------------------------------------------------
# 4. Helper pour obtenir l'attribut `enabled` quel que soit le client
# --------------------------------------------------------------------------
def is_enabled() -> bool:
    """True si le vrai client Langfuse tourne (utile pour skip des calculs coûteux)."""
    # Le vrai client n'expose pas `.enabled` ; on vérifie par type.
    return not isinstance(langfuse, _NullLangfuse)


# --------------------------------------------------------------------------
# 5. Flush côté shutdown (évite de perdre les dernières traces)
# --------------------------------------------------------------------------
def flush() -> None:
    """À appeler au shutdown de l'API pour forcer l'envoi des traces en buffer."""
    try:
        langfuse.flush()
    except Exception as exc:
        print(f"⚠️  Langfuse flush error : {exc}")
