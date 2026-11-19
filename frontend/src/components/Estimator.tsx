import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { api } from "../api/client";
import { DEMO_SERVICES, SHORT_NAMES, type ServiceSlug } from "../data/demo";
import { estimatePrice, formatMoney, type EstimateResult, type HomeSize, type Urgency } from "../lib/pricing";
import { SERVICE_ICONS } from "./icons";

const SIZES: { value: HomeSize; label: string; hint: string }[] = [
  { value: "small", label: "Klein", hint: "< 80 m²" },
  { value: "medium", label: "Mittel", hint: "80–150 m²" },
  { value: "large", label: "Groß", hint: "150–250 m²" },
  { value: "xl", label: "XL", hint: "250+ m²" },
];
const URGENCY: { value: Urgency; label: string; hint: string }[] = [
  { value: "standard", label: "Flexibel", hint: "Innerhalb 3 Tagen" },
  { value: "next_day", label: "Morgen", hint: "+15 %" },
  { value: "emergency", label: "Notfall", hint: "In 2 Std. · +50 %" },
];
const DEBOUNCE_MS = 250;
const MIN_HOURS = 1;
const MAX_HOURS = 8;

function Segmented<T extends string>({ legend, options, value, onChange }: { legend: string; options: { value: T; label: string; hint: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className={`mt-2 grid gap-2 ${options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={`rounded-xl border-2 px-2 py-2.5 text-center transition ${value === o.value ? "border-safety bg-safety/10" : "border-slate-200 bg-white hover:border-navy/30"}`}>
            <span className="block text-sm font-bold text-navy">{o.label}</span>
            <span className="block text-[11px] text-steel">{o.hint}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Estimator({ initialService = "plumbing" }: { initialService?: ServiceSlug }) {
  const [service, setService] = useState<ServiceSlug>(initialService);
  const [homeSize, setHomeSize] = useState<HomeSize>("medium");
  const [hours, setHours] = useState(2);
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const input = useMemo(() => ({ service, home_size: homeSize, hours, urgency }), [service, homeSize, hours, urgency]);
  const key = JSON.stringify(input);
  const [remote, setRemote] = useState<{ key: string; result: EstimateResult } | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      api
        .post<EstimateResult>("/api/estimate", input)
        .then((result) => active && setRemote({ key, result }))
        .catch(() => undefined); // offline: the local estimate is already shown
    }, DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [input, key]);

  const result = remote?.key === key ? remote.result : estimatePrice(input);
  const serviceName = DEMO_SERVICES.find((s) => s.slug === service)?.name ?? service;

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6 p-5 sm:p-8">
        <fieldset>
          <legend className="field-label">Was benötigen Sie?</legend>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {DEMO_SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.slug];
              const active = s.slug === service;
              return (
                <button key={s.slug} type="button" aria-pressed={active} aria-label={s.name} onClick={() => setService(s.slug)} className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-bold transition ${active ? "border-safety bg-safety text-white" : "border-slate-200 bg-white text-navy hover:border-navy/30"}`}>
                  <Icon className="size-5" aria-hidden />
                  <span className="w-full [overflow-wrap:anywhere] hyphens-auto">{SHORT_NAMES[s.slug]}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <Segmented legend="Wohnfläche" options={SIZES} value={homeSize} onChange={setHomeSize} />
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="hours" className="field-label">Geschätzte Dauer</label>
            <output htmlFor="hours" className="font-display text-lg font-extrabold text-navy">{hours} {hours === 1 ? "Stunde" : "Stunden"}</output>
          </div>
          <input id="hours" type="range" min={MIN_HOURS} max={MAX_HOURS} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-safety)]" />
        </div>
        <Segmented legend="Wie dringend?" options={URGENCY} value={urgency} onChange={setUrgency} />
      </div>
      <div className="stripes relative flex flex-col justify-between gap-6 bg-navy p-6 text-white sm:p-8" aria-live="polite">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-safety uppercase">Ihre Schätzung</p>
          <p className="mt-2 text-sm text-white/70">{serviceName} · {hours} Std. · Wohnfläche {SIZES.find((s) => s.value === homeSize)?.label.toLowerCase()}</p>
          <p className="mt-4 font-display text-5xl font-extrabold sm:text-6xl" data-testid="estimate-range">{formatMoney(result.low)}<span className="text-white/50">–</span>{formatMoney(result.high)}</p>
          <dl className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-white/70">Anfahrt</dt><dd className="font-bold">{result.trip_fee ? formatMoney(result.trip_fee) : "Kostenlos"}</dd></div>
            <div className="flex justify-between"><dt className="text-white/70">Stundensatz</dt><dd className="font-bold">{formatMoney(result.hourly_rate)}/Std.</dd></div>
            <div className="flex justify-between"><dt className="text-white/70">Dringlichkeitszuschlag</dt><dd className="font-bold">{result.urgency_surcharge ? formatMoney(result.urgency_surcharge) : "Keiner"}</dd></div>
          </dl>
        </div>
        <div className="space-y-3">
          <Link to={`/book?service=${service}`} className="btn-primary w-full">Diesen Auftrag buchen <ArrowRight className="size-4" aria-hidden /></Link>
          <p className="flex gap-2 text-xs text-white/60"><Info className="size-4 shrink-0" aria-hidden />Der Endpreis wird vor Ort vor Arbeitsbeginn bestätigt. Material wird zum Einkaufspreis berechnet.</p>
        </div>
      </div>
    </div>
  );
}
