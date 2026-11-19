import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Clock3, Loader2, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SelectField, TextArea, TextField } from "../components/Field";
import { useToast } from "../components/toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { rules, validate, type Errors } from "../lib/validation";
import { DEMO_SERVICES } from "../data/demo";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time_window: string;
  zip: string;
  address: string;
  notes: string;
};

interface BookingResult {
  id: number;
  message: string;
}

const WINDOWS = [
  { value: "morning", name: "Vormittag", label: "8–11 Uhr" },
  { value: "midday", name: "Mittag", label: "11–14 Uhr" },
  { value: "afternoon", name: "Nachmittag", label: "14–17 Uhr" },
  { value: "evening", name: "Abend", label: "17–20 Uhr" },
];
const MAX_DAYS = 90;
const DAY_MS = 86_400_000;

const isoDay = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * DAY_MS);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const futureDate = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Bitte wählen Sie ein Datum";
  if (v < isoDay(1)) return "Bitte wählen Sie ein Datum in der Zukunft";
  if (v > isoDay(MAX_DAYS)) return `Bitte wählen Sie ein Datum innerhalb von ${MAX_DAYS} Tagen`;
  return null;
};

const SCHEMA = {
  name: [rules.name],
  email: [rules.email],
  phone: [rules.phone],
  service: [rules.required("Leistung")],
  date: [futureDate],
  time_window: [rules.required("Zeitfenster")],
  zip: [(v: string) => (/^\d{5}$/.test(v.trim()) ? null : "Bitte geben Sie eine 5-stellige PLZ ein")],
  address: [rules.minLength("Adresse", 5), rules.safeText],
  notes: [rules.safeText],
};

const PERKS = [
  { icon: Clock3, text: "Wir schicken Ihnen eine SMS, sobald Ihr Profi losfährt" },
  { icon: ShieldCheck, text: "Sie geben den Preis frei, bevor wir beginnen" },
  { icon: BadgeCheck, text: "1 Jahr Garantie auf unsere Arbeit" },
];

export default function Book() {
  const [params] = useSearchParams();
  const requested = params.get("service");
  const plan = params.get("plan");
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    service: DEMO_SERVICES.some((s) => s.slug === requested) ? (requested as string) : "plumbing",
    date: isoDay(1),
    time_window: "morning",
    zip: "",
    address: "",
    notes: plan ? `Ich möchte den Wartungsvertrag „${plan}“ abschließen.` : "",
  });
  const [errors, setErrors] = useState<Errors<FormValues>>({});
  const { status, result, submit, reset } = useSubmit<FormValues, BookingResult>("/api/bookings");
  const toast = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") cardRef.current?.scrollIntoView?.({ block: "center" });
  }, [status]);

  const set = (key: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values, SCHEMA);
    setErrors(found);
    if (Object.keys(found).length) {
      toast("error", "Bitte korrigieren Sie die markierten Felder.");
      return;
    }
    const data = await submit(values);
    if (data) toast("success", data.message);
    else toast("error", "Der Termin konnte nicht gebucht werden. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns an.");
  }

  return (
    <>
      <PageHeader eyebrow="Online buchen" title={<>Profi buchen in <span className="text-safety">60 Sekunden</span></>} lead="Wählen Sie Leistung und Ankunftszeitfenster. Sie erhalten sofort eine Bestätigung." image="/images/handyman.jpg" />
      <section className="section">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_2fr]">
          <aside className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="card flex items-center gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-safety/10 text-safety"><Icon className="size-5" aria-hidden /></span>
                <p className="text-sm font-bold text-navy">{text}</p>
              </div>
            ))}
            <img src="/images/plumbing.jpg" alt="Sauber und fachgerecht verlegte Sanitärinstallation" loading="lazy" className="hidden aspect-[4/3] w-full rounded-2xl object-cover lg:block" />
          </aside>

          <div ref={cardRef} className="card scroll-mt-32 p-5 sm:p-10">
            {status === "success" && result ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center" role="status">
                <CheckCircle2 className="mx-auto size-16 text-emerald-500" aria-hidden />
                <h2 className="mt-6 text-3xl text-navy">Termin gebucht!</h2>
                <p className="lead mx-auto mt-3 max-w-md">{result.message}</p>
                <p className="mt-2 text-sm text-steel">Buchungsnr. PF-{String(result.id).padStart(5, "0")}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/" className="btn-outline">Zur Startseite</Link>
                  <button type="button" className="btn-primary" onClick={reset}>Weiteren Termin buchen</button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-2xl text-navy">Termin vereinbaren</h2>
                  <p className="mt-1 text-sm text-steel">Alle Felder außer den Hinweisen sind Pflichtfelder.</p>
                </div>
                <SelectField label="Leistung" name="service" value={values.service} onChange={set("service")} error={errors.service}>
                  {DEMO_SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </SelectField>
                <TextField label="Wunschtermin" name="date" type="date" min={isoDay(1)} max={isoDay(MAX_DAYS)} value={values.date} onChange={set("date")} error={errors.date} />
                <fieldset className="sm:col-span-2">
                  <legend className="field-label">Ankunftszeitfenster</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {WINDOWS.map((w) => (
                      <label key={w.value} className={`cursor-pointer rounded-xl border-2 px-3 py-3 text-center text-sm font-bold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-safety/30 ${values.time_window === w.value ? "border-safety bg-safety/10 text-navy" : "border-slate-200 text-navy hover:border-navy/30"}`}>
                        <input type="radio" name="time_window" value={w.value} checked={values.time_window === w.value} onChange={set("time_window")} className="sr-only" />
                        <span className="block">{w.name}</span>
                        <span className="block text-xs font-normal text-steel">{w.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <TextField label="Vollständiger Name" name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={80} placeholder="Jonas Becker" />
                <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} placeholder="+49 89 1234 5678" />
                <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} maxLength={120} placeholder="sie@beispiel.de" />
                <TextField label="Postleitzahl" name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={values.zip} onChange={set("zip")} error={errors.zip} placeholder="80331" hint="Probieren Sie 80331, 85737 oder 82131" />
                <div className="sm:col-span-2">
                  <TextField label="Straße und Hausnummer" name="address" autoComplete="street-address" value={values.address} onChange={set("address")} error={errors.address} maxLength={160} placeholder="Ahornstraße 88, München" />
                </div>
                <div className="sm:col-span-2">
                  <TextArea label="Worum geht es? (optional)" name="notes" value={values.notes} onChange={set("notes")} error={errors.notes} maxLength={1000} placeholder="Die Küchenspüle tropft unter dem Unterschrank …" />
                </div>
                <button type="submit" className="btn-primary text-base sm:col-span-2" disabled={status === "submitting"}>
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden />Wird gebucht …</> : "Buchung bestätigen"}
                </button>
                <p className="text-center text-xs text-steel sm:col-span-2">Demo-Formular: Buchungen werden nur in der lokalen Demo-Datenbank gespeichert.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
