// Demo-mode responses for the static (GitHub Pages) build, where no backend runs.
// Mirrors the success payloads of backend/app/routers so forms show their real confirmation.
// Nothing is sent or stored anywhere.

type Payload = Readonly<Record<string, unknown>>;
type Handler = (p: Payload) => unknown;

const ID_RANGE = 100_000;

const demoId = (): number => Date.now() % ID_RANGE;
const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (p: Payload, key: string): string => String(p[key] ?? "").trim();
/** "2026-11-24" -> "24.11.2026" */
const germanDate = (iso: string): string => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
};

const SERVICE_NAMES: Readonly<Record<string, string>> = {
  plumbing: "Sanitär",
  cleaning: "Haushaltsreinigung",
  electrical: "Elektrik",
  hvac: "Heizung & Klima",
  handyman: "Hausmeisterservice",
};
const TIME_WINDOWS: Readonly<Record<string, string>> = {
  morning: "8–11 Uhr",
  midday: "11–14 Uhr",
  afternoon: "14–17 Uhr",
  evening: "17–20 Uhr",
};

const HANDLERS: Readonly<Record<string, Handler>> = {
  "/api/bookings": (p) => {
    const service = SERVICE_NAMES[text(p, "service")] ?? text(p, "service");
    const slot = TIME_WINDOWS[text(p, "time_window")] ?? text(p, "time_window");
    return {
      id: demoId(),
      message: `Vielen Dank, ${text(p, "name")}! Ihr Termin für ${service} ist am ${germanDate(text(p, "date"))} (${slot}) gebucht.`,
    };
  },
};

const FALLBACK_MESSAGE = "Vielen Dank! Ihre Anfrage ist eingegangen.";

export function demoResponse(path: string, payload: unknown): unknown {
  const handler = HANDLERS[path];
  const body = isPayload(payload) ? payload : {};
  return handler ? handler(body) : { id: demoId(), message: FALLBACK_MESSAGE };
}
