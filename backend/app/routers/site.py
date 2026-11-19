"""Home-services endpoints."""
import json

from fastapi import APIRouter, HTTPException, Query, Request

from ..config import settings
from ..db import fetch_all, insert
from ..responses import ok
from ..schemas import ZIP_PATTERN, BookingRequest, EstimateRequest
from ..security import limiter

router = APIRouter()

# (trip fee, hourly labor rate) per service
RATES = {
    "plumbing": (59, 79),
    "electrical": (59, 85),
    "hvac": (69, 89),
    "handyman": (39, 55),
    "cleaning": (0, 39),
}
SIZE_FACTOR = {"small": 0.85, "medium": 1.0, "large": 1.25, "xl": 1.5}
URGENCY_FACTOR = {"standard": 1.0, "next_day": 1.15, "emergency": 1.5}
RANGE_SPREAD = 1.2
SERVICE_NAMES = {
    "plumbing": "Sanitär",
    "cleaning": "Haushaltsreinigung",
    "electrical": "Elektrik",
    "hvac": "Heizung & Klima",
    "handyman": "Hausmeisterservice",
}
TIME_WINDOWS = {
    "morning": "8–11 Uhr",
    "midday": "11–14 Uhr",
    "afternoon": "14–17 Uhr",
    "evening": "17–20 Uhr",
}


def estimate_price(req: EstimateRequest) -> dict:
    trip_fee, rate = RATES[req.service]
    labor = rate * req.hours * SIZE_FACTOR[req.home_size]
    subtotal = (trip_fee + labor) * URGENCY_FACTOR[req.urgency]
    low = round(subtotal)
    return {
        "service": req.service,
        "low": low,
        "high": round(low * RANGE_SPREAD),
        "trip_fee": trip_fee,
        "hourly_rate": rate,
        "urgency_surcharge": round(subtotal - (trip_fee + labor)),
    }


def _service_row(row: dict) -> dict:
    return {**row, "features": json.loads(row["features"])}


def _area(zip_code: str) -> dict | None:
    rows = fetch_all("SELECT zip, city, eta_minutes FROM service_areas WHERE zip = ?", (zip_code,))
    return rows[0] if rows else None


@router.get("/services")
def list_services():
    return ok([_service_row(r) for r in fetch_all("SELECT * FROM services ORDER BY position")])


@router.get("/services/{slug}")
def get_service(slug: str):
    rows = fetch_all("SELECT * FROM services WHERE slug = ?", (slug,))
    if not rows:
        raise HTTPException(status_code=404, detail="Leistung nicht gefunden.")
    return ok(_service_row(rows[0]))


@router.get("/reviews")
def list_reviews():
    return ok(fetch_all("SELECT * FROM reviews ORDER BY id"))


@router.get("/plans")
def list_plans():
    rows = fetch_all("SELECT * FROM plans ORDER BY id")
    return ok([{**r, "features": json.loads(r["features"]), "featured": bool(r["featured"])} for r in rows])


@router.get("/service-areas")
def list_areas():
    return ok(fetch_all("SELECT zip, city, eta_minutes FROM service_areas ORDER BY city, zip"))


@router.get("/service-areas/check")
@limiter.limit("60/minute")
def check_area(request: Request, zip: str = Query(pattern=ZIP_PATTERN)):
    area = _area(zip)
    if area is None:
        return ok({"zip": zip, "covered": False, "city": None, "eta_minutes": None})
    return ok({**area, "covered": True})


@router.post("/estimate")
@limiter.limit("120/minute")
def estimate(request: Request, body: EstimateRequest):
    return ok(estimate_price(body))


@router.post("/bookings", status_code=201)
@limiter.limit(settings.rate_limit)
def create_booking(request: Request, body: BookingRequest):
    if _area(body.zip) is None:
        raise HTTPException(status_code=422, detail="PLZ: Diese Postleitzahl bedienen wir leider noch nicht")
    booking_id = insert(
        "INSERT INTO bookings (name, email, phone, service, date, time_window, zip, address, notes)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (body.name, str(body.email), body.phone, body.service, body.date.isoformat(),
         body.time_window, body.zip, body.address, body.notes),
    )
    return ok({
        "id": booking_id,
        "message": (
            f"Vielen Dank, {body.name}! Ihr Termin für {SERVICE_NAMES[body.service]} ist am "
            f"{body.date:%d.%m.%Y} ({TIME_WINDOWS[body.time_window]}) gebucht."
        ),
    })
