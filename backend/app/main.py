"""FastAPI application factory."""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .db import get_connection
from .responses import fail, ok
from .routers import site
from .security import BodySizeLimitMiddleware, SecurityHeadersMiddleware, limiter
from .seed import seed

logger = logging.getLogger("demo")


FIELD_LABELS = {
    "name": "Name", "email": "E-Mail", "phone": "Telefon", "service": "Leistung", "date": "Datum",
    "time_window": "Zeitfenster", "zip": "PLZ", "address": "Adresse", "notes": "Hinweise",
    "home_size": "Wohnfläche", "hours": "Stunden", "urgency": "Dringlichkeit",
}
STATIC_MESSAGES = {
    "missing": "Pflichtfeld",
    "extra_forbidden": "unbekanntes Feld",
    "literal_error": "ungültige Auswahl",
    "string_pattern_mismatch": "ungültiges Format",
    "json_invalid": "ungültiges JSON",
}


def _number(value: object) -> str:
    return f"{value:g}".replace(".", ",") if isinstance(value, (int, float)) else str(value)


def _german_message(err: dict) -> str:
    kind = str(err.get("type", ""))
    ctx = err.get("ctx") or {}
    if kind in STATIC_MESSAGES:
        return STATIC_MESSAGES[kind]
    if kind == "string_too_short":
        return f"mindestens {ctx.get('min_length')} Zeichen"
    if kind == "string_too_long":
        return f"höchstens {ctx.get('max_length')} Zeichen"
    if kind == "greater_than_equal":
        return f"muss mindestens {_number(ctx.get('ge'))} sein"
    if kind == "less_than_equal":
        return f"darf höchstens {_number(ctx.get('le'))} sein"
    if kind.startswith("date"):
        return "ungültiges Datum"
    if kind == "value_error":
        if err.get("loc", ())[-1:] == ("email",):
            return "ungültige E-Mail-Adresse"
        return str(err.get("msg", "")).removeprefix("Value error, ")
    return "ungültiger Wert"


def _format_validation(exc: RequestValidationError) -> str:
    messages = []
    for err in exc.errors():
        parts = [str(p) for p in err.get("loc", ()) if p not in ("body", "query")]
        field = ".".join(FIELD_LABELS.get(p, p) for p in parts)
        msg = _german_message(err)
        messages.append(f"{field}: {msg}" if field else msg)
    return "; ".join(messages) or "Ungültige Anfrage."


def create_app() -> FastAPI:
    app = FastAPI(title=f"{settings.site_name} API", version="1.0.0")
    app.state.limiter = limiter

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(BodySizeLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.exception_handler(RequestValidationError)
    async def on_validation(_: Request, exc: RequestValidationError):
        return JSONResponse(fail(_format_validation(exc)), status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def on_rate_limit(_: Request, __: RateLimitExceeded):
        return JSONResponse(fail("Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal."), status_code=429)

    @app.exception_handler(StarletteHTTPException)
    async def on_http(_: Request, exc: StarletteHTTPException):
        detail = exc.detail if isinstance(exc.detail, str) else "Anfrage fehlgeschlagen."
        return JSONResponse(fail(detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def on_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path, exc_info=exc)
        return JSONResponse(fail("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."), status_code=500)

    @app.get("/api/health")
    def health():
        return ok({"status": "ok", "site": settings.site_name})

    app.include_router(site.router, prefix="/api")
    seed(get_connection())
    return app


app = create_app()
