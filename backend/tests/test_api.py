from datetime import date, timedelta

TOMORROW = (date.today() + timedelta(days=1)).isoformat()

VALID_BOOKING = {
    "name": "Jonas Becker",
    "email": "jonas@example.com",
    "phone": "+49 89 1234 5678",
    "service": "plumbing",
    "date": TOMORROW,
    "time_window": "morning",
    "zip": "80331",
    "address": "Ahornstraße 88, 80331 München",
    "notes": "Die Küchenspüle tropft.",
}


def test_health_returns_envelope(client):
    res = client.get("/api/health")
    assert res.json() == {"success": True, "data": {"status": "ok", "site": "ProFix Haus-Service"}, "error": None}


def test_security_headers_present(client):
    res = client.get("/api/health")
    assert res.headers["x-content-type-options"] == "nosniff"
    assert res.headers["x-frame-options"] == "DENY"


def test_cors_allows_only_configured_origin(client):
    allowed = client.get("/api/health", headers={"Origin": "http://localhost:5175"})
    blocked = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:5175"
    assert "access-control-allow-origin" not in blocked.headers


def test_services_list_and_detail(client):
    services = client.get("/api/services").json()["data"]
    assert [s["slug"] for s in services] == ["plumbing", "cleaning", "electrical", "hvac", "handyman"]
    assert isinstance(services[0]["features"], list)
    detail = client.get("/api/services/hvac").json()["data"]
    assert detail["name"] == "Heizung & Klima"


def test_unknown_service_404(client):
    res = client.get("/api/services/roofing")
    assert res.status_code == 404
    assert res.json() == {"success": False, "data": None, "error": "Leistung nicht gefunden."}


def test_reviews_plans_areas(client):
    assert len(client.get("/api/reviews").json()["data"]) == 6
    plans = client.get("/api/plans").json()["data"]
    assert sum(p["featured"] for p in plans) == 1
    assert len(client.get("/api/service-areas").json()["data"]) == 12


def test_zip_check_covered_and_not(client):
    yes = client.get("/api/service-areas/check?zip=85737").json()["data"]
    no = client.get("/api/service-areas/check?zip=10115").json()["data"]
    assert yes["covered"] is True and yes["city"] == "Ismaning"
    assert no == {"zip": "10115", "covered": False, "city": None, "eta_minutes": None}


def test_zip_check_rejects_bad_pattern(client):
    for bad in ["abc", "1234", "80331' OR '1'='1"]:
        res = client.get("/api/service-areas/check", params={"zip": bad})
        assert res.status_code == 422
        assert res.json()["success"] is False


def test_estimate_scales_with_urgency_and_size(client):
    base = client.post("/api/estimate", json={"service": "plumbing", "hours": 2}).json()["data"]
    urgent = client.post("/api/estimate", json={"service": "plumbing", "hours": 2, "urgency": "emergency"}).json()["data"]
    big = client.post("/api/estimate", json={"service": "plumbing", "hours": 2, "home_size": "xl"}).json()["data"]
    assert base["low"] == 217 and base["high"] == 260
    assert urgent["low"] > base["low"] and urgent["urgency_surcharge"] > 0
    assert big["low"] > base["low"]


def test_estimate_rejects_invalid(client):
    assert client.post("/api/estimate", json={"service": "roofing"}).status_code == 422
    assert client.post("/api/estimate", json={"service": "cleaning", "hours": 40}).status_code == 422


def test_booking_success(client):
    res = client.post("/api/bookings", json=VALID_BOOKING)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["id"] == 1
    assert "Jonas Becker" in data["message"] and "Sanitär" in data["message"]
    assert "8–11 Uhr" in data["message"]


def test_booking_rejects_past_and_far_dates(client):
    past = {**VALID_BOOKING, "date": date.today().isoformat()}
    far = {**VALID_BOOKING, "date": (date.today() + timedelta(days=120)).isoformat()}
    assert "in der Zukunft" in client.post("/api/bookings", json=past).json()["error"]
    assert "90 Tage" in client.post("/api/bookings", json=far).json()["error"]


def test_booking_rejects_uncovered_zip(client):
    res = client.post("/api/bookings", json={**VALID_BOOKING, "zip": "10115"})
    assert res.status_code == 422
    assert "PLZ" in res.json()["error"]


def test_booking_rejects_bad_fields(client):
    cases = [
        {"email": "nope"},
        {"phone": "call me"},
        {"zip": "8033"},
        {"service": "roofing"},
        {"time_window": "midnight"},
        {"name": "<script>alert(1)</script>"},
        {"is_admin": True},
    ]
    for override in cases:
        res = client.post("/api/bookings", json={**VALID_BOOKING, **override})
        assert res.status_code == 422, override


def test_sql_injection_is_stored_as_text(client):
    payload = {**VALID_BOOKING, "notes": "'); DROP TABLE bookings; --"}
    assert client.post("/api/bookings", json=payload).status_code == 201
    assert client.post("/api/bookings", json=VALID_BOOKING).json()["data"]["id"] == 2


def test_body_too_large_rejected(client):
    res = client.post("/api/bookings", content=b"x" * 20000, headers={"Content-Type": "application/json"})
    assert res.status_code == 413


def test_invalid_content_length_rejected(client):
    res = client.post("/api/bookings", content=b"{}", headers={"Content-Type": "application/json", "Content-Length": "abc"})
    assert res.status_code in (400, 422)


def test_rate_limit_on_bookings(client):
    codes = [client.post("/api/bookings", json=VALID_BOOKING).status_code for _ in range(12)]
    assert 429 in codes
    assert "Zu viele Anfragen" in client.post("/api/bookings", json=VALID_BOOKING).json()["error"]


def test_validation_messages_are_german(client):
    res = client.post("/api/bookings", json={**VALID_BOOKING, "email": "nope", "name": "A", "is_admin": True})
    error = res.json()["error"]
    assert "E-Mail: ungültige E-Mail-Adresse" in error
    assert "Name: mindestens 2 Zeichen" in error
    assert "is_admin: unbekanntes Feld" in error
    missing = client.post("/api/bookings", json={k: v for k, v in VALID_BOOKING.items() if k != "phone"})
    assert "Telefon: Pflichtfeld" in missing.json()["error"]
    hours = client.post("/api/estimate", json={"service": "cleaning", "hours": 40}).json()["error"]
    assert hours == "Stunden: darf höchstens 12 sein"
    service = client.post("/api/estimate", json={"service": "roofing"}).json()["error"]
    assert service == "Leistung: ungültige Auswahl"
