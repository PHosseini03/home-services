# ProFix Haus-Service: demo website

**Live-Demo:** https://PHosseini03.github.io/home-services/ · **Alle Demos:** https://PHosseini03.github.io/website-showcase/

A bold, navy-and-safety-orange website for a home services company (plumbing, house cleaning, electrical, HVAC, handyman). React + TypeScript frontend and a FastAPI backend.

**Language:** the whole site is in German (formal "Sie"), with euro prices, German date formats, +49 phone numbers and Munich-area postcodes. API error messages are German too.

![Desktop](screenshots/hero.png)

## Features
- 24/7 emergency call bar, sticky header, mobile menu with call / book buttons
- Service picker with a page for each service (`/services/:slug`)
- **Instant price estimator** (service, home size, job length, urgency), priced live by the Python API, with an offline fallback
- **Online booking**: service, future date (up to 90 days), arrival window, 5-digit German postcode (PLZ) and address, validated on client and server; postcodes outside the service area are rejected
- **Service-area postcode (PLZ) checker** with typical arrival time
- Reviews, written guarantees, how-it-works steps, membership plans, 404 page
- Fully responsive (360px to 1440px+), keyboard accessible, respects reduced-motion

## Run it
| Part | Port | Command (from this folder) |
|---|---|---|
| API | 8005 | `cd backend; python -m venv .venv; .venv\Scripts\pip install -r requirements.txt; .venv\Scripts\python -m uvicorn app.main:app --port 8005` |
| Web | 5175 | `cd frontend; npm install; npm run dev` |

Open http://localhost:5175. API docs: http://localhost:8005/docs. Or run `..\start-site.ps1 home-services` from the root folder.

Try postcodes 80331, 85737 or 82131 (covered) and 10115 (not covered).

## Pages
`/`, `/services`, `/services/:slug` (plumbing, cleaning, electrical, hvac, handyman), `/estimate`, `/plans`, `/book`, and a 404 page for anything else.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/services` | All services |
| GET | `/api/services/{slug}` | One service (404 if unknown) |
| GET | `/api/reviews` | Customer reviews |
| GET | `/api/plans` | Maintenance plans |
| GET | `/api/service-areas` | Covered postcodes |
| GET | `/api/service-areas/check?zip=` | Postcode coverage check (60/min) |
| POST | `/api/estimate` | Price estimate (120/min) |
| POST | `/api/bookings` | Create a booking (10/min) |

All responses use `{ "success": bool, "data": ..., "error": string | null }`.

## Quality
- Backend: `pip install -r requirements-dev.txt; pytest --cov=app` (19 tests, 96% coverage)
- Frontend: `npm test` (21 tests, 93% statement coverage), `npm run lint`, `npm run build`
- Security: strict Pydantic schemas (extra fields rejected), parameterized SQL, rate limiting, body-size limit, CORS allow-list, security headers, no secrets in code.

*Demo only. The company, people, reviews and figures are fictional. Photos: Unsplash (free licence).*
