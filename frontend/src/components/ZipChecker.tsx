import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MapPin, XCircle } from "lucide-react";
import { api } from "../api/client";
import { DEMO_AREAS } from "../data/demo";

interface CheckResult {
  zip: string;
  covered: boolean;
  city: string | null;
  eta_minutes: number | null;
}

const ZIP_RE = /^\d{5}$/;

function localCheck(zip: string): CheckResult {
  const area = DEMO_AREAS.find((a) => a.zip === zip);
  return area ? { ...area, covered: true } : { zip, covered: false, city: null, eta_minutes: null };
}

export function ZipChecker({ dark = false }: { dark?: boolean }) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = zip.trim();
    if (!ZIP_RE.test(value)) {
      setError("Bitte geben Sie eine 5-stellige PLZ ein");
      setResult(null);
      return;
    }
    setError(null);
    setChecking(true);
    try {
      setResult(await api.get<CheckResult>(`/api/service-areas/check?zip=${encodeURIComponent(value)}`));
    } catch {
      setResult(localCheck(value));
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2 sm:flex-row" aria-label="Einsatzgebiet prüfen">
        <label htmlFor="zip-check" className="sr-only">Postleitzahl</label>
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-steel" aria-hidden />
          <input id="zip-check" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="Ihre PLZ, z. B. 80331" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} aria-invalid={!!error} aria-describedby={error ? "zip-check-error" : undefined} className="field-input !py-3.5 !pl-12" />
        </div>
        <button type="submit" className="btn-primary" disabled={checking}>
          {checking ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Gebiet prüfen
        </button>
      </form>
      <div aria-live="polite" className="min-h-6">
        {error && <p id="zip-check-error" className={`mt-2 text-sm font-semibold ${dark ? "text-rose-300" : "text-rose-600"}`}>{error}</p>}
        {result && (
          <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${dark ? "text-white" : "text-navy"}`}>
            {result.covered ? (
              <><CheckCircle2 className="size-5 text-emerald-500" aria-hidden />Gute Nachricht! Wir sind in {result.zip} {result.city} für Sie da. Übliche Anfahrt: {result.eta_minutes} Min.</>
            ) : (
              <><XCircle className="size-5 text-rose-500" aria-hidden />Leider sind wir in {result.zip} noch nicht im Einsatz. Rufen Sie uns an – wir empfehlen Ihnen gern einen Partnerbetrieb.</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
