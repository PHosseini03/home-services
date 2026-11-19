import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, CircleDollarSign, ClipboardList, HandCoins, Phone, ShieldCheck, Smile, ThumbsUp, Timer } from "lucide-react";
import { Hero } from "../components/Hero";
import { ServiceCard } from "../components/ServiceCard";
import { Estimator } from "../components/Estimator";
import { ReviewCard } from "../components/ReviewCard";
import { PlanCards } from "../components/PlanCards";
import { ZipChecker } from "../components/ZipChecker";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { useApi } from "../hooks/useApi";
import { useCountUp } from "../hooks/useCountUp";
import { CONTACT, DEMO_REVIEWS, DEMO_SERVICES, type Review, type Service } from "../data/demo";

const STATS = [
  { value: 48000, suffix: "+", label: "Erledigte Aufträge" },
  { value: 120, suffix: "", label: "Zertifizierte Fachkräfte" },
  { value: 42, suffix: " Min.", label: "Ø Anfahrt im Notfall" },
  { value: 98, suffix: " %", label: "Beim ersten Besuch gelöst" },
];

const GUARANTEES = [
  { icon: CircleDollarSign, title: "Festpreis vorab", text: "Sie bestätigen den genauen Preis, bevor wir beginnen. Keine bösen Überraschungen." },
  { icon: Timer, title: "Pünktlich oder 50 € Rabatt", text: "Wir schicken eine SMS, sobald wir losfahren. Zu spät? Dann wird Ihr nächster Einsatz günstiger." },
  { icon: ThumbsUp, title: "1 Jahr Garantie", text: "Hält unsere Reparatur kein Jahr, beheben wir den Schaden kostenlos. Punkt." },
  { icon: ShieldCheck, title: "Nur geprüfte Profis", text: "Jede Fachkraft ist ausgebildet, versichert und persönlich überprüft." },
];

const STEPS = [
  { icon: ClipboardList, title: "Problem schildern", text: "In 60 Sekunden online buchen oder rund um die Uhr anrufen." },
  { icon: CalendarCheck, title: "Termin wählen", text: "Wählen Sie ein Zeitfenster. Bei Dringendem noch am selben Tag." },
  { icon: HandCoins, title: "Preis freigeben", text: "Ihr Profi prüft das Problem und nennt den Preis vor Arbeitsbeginn." },
  { icon: Smile, title: "Entspannen – erledigt", text: "Saubere Arbeit mit Garantie. Zahlung per Karte oder Finanzierung." },
];

function Stat({ value, suffix, label }: (typeof STATS)[number]) {
  const { ref, value: n } = useCountUp(value);
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        <span ref={ref}>{Math.round(n).toLocaleString("de-DE")}</span>
        <span className="text-safety">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}

export default function Home() {
  const { data: services } = useApi<Service[]>("/api/services", DEMO_SERVICES);
  const { data: reviews } = useApi<Review[]>("/api/reviews", DEMO_REVIEWS);
  return (
    <>
      <Hero />
      <section aria-label="Unternehmen in Zahlen" className="stripes bg-navy">
        <div className="container-x grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {STATS.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle center={false} eyebrow="Unsere Leistungen" title="Ein Anruf – alles erledigt" lead="Fünf Gewerke, ein vertrautes Team. Jeder Auftrag mit 1 Jahr Garantie." />
            <Link to="/services" className="btn-outline">Alle Leistungen <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s, i) => <Reveal key={s.slug} delay={i * 0.05}><ServiceCard service={s} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionTitle eyebrow="Preisrechner" title="Den Preis kennen, bevor wir klingeln" lead="Wählen Sie Leistung und Umfang. Der Preis wird live von unserem Planungssystem berechnet." />
          <Reveal className="mt-10"><Estimator /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">Das ProFix-Versprechen</span>
            <h2 className="heading mt-3">Garantien, die andere nicht schriftlich geben.</h2>
            <p className="lead mt-4">Unser Ruf beruht darauf, dass wir pünktlich kommen, den genannten Preis berechnen und für unsere Arbeit geradestehen.</p>
            <a href={`tel:${CONTACT.tel}`} className="btn-navy mt-8"><Phone className="size-4" aria-hidden />Mit einem Menschen sprechen</a>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {GUARANTEES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="card h-full border-l-4 !border-l-safety p-6">
                  <Icon className="size-8 text-safety" aria-hidden />
                  <h3 className="mt-4 text-lg text-navy">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-deep text-white">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">So funktioniert’s</span>
            <h2 className="mt-3 text-3xl text-white sm:text-4xl lg:text-5xl">In einer Minute gebucht. Heute repariert.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <li className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="absolute top-5 right-5 font-display text-5xl font-extrabold text-white/10">{i + 1}</span>
                  <span className="grid size-12 place-items-center rounded-xl bg-safety text-white"><Icon className="size-6" aria-hidden /></span>
                  <h3 className="mt-5 text-lg text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-white/65">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="Bewertungen" title="Unsere Kunden lieben ihren ProFix-Profi" lead="4,9 von 5 Sternen aus über 3.100 verifizierten Bewertungen." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => <Reveal key={r.id} delay={(i % 3) * 0.05}><ReviewCard review={r} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionTitle eyebrow="Wartungsverträge" title="Ausfällen vorbeugen. Bei jeder Reparatur sparen." />
          <div className="mt-12"><PlanCards /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-3xl bg-navy lg:grid-cols-2">
              <div className="p-6 sm:p-12">
                <span className="eyebrow">Einsatzgebiet</span>
                <h2 className="mt-3 text-3xl text-white sm:text-4xl">Sind wir in Ihrer Nähe im Einsatz?</h2>
                <p className="mt-4 text-white/70">München, Unterschleißheim, Ismaning, Unterhaching, Ottobrunn, Gauting, Planegg und mehr.</p>
                <div className="mt-8"><ZipChecker dark /></div>
              </div>
              <img src="/images/house.jpg" alt="Modernes Einfamilienhaus im ProFix-Einsatzgebiet" loading="lazy" className="h-64 w-full object-cover lg:h-full" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stripes bg-safety">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl text-white sm:text-4xl">Gerade etwas kaputt?</h2>
            <p className="mt-2 font-semibold text-white/90">Unser Notdienst ist 24 Stunden am Tag, 365 Tage im Jahr für Sie erreichbar.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${CONTACT.tel}`} className="btn-navy text-base"><Phone className="size-4" aria-hidden />{CONTACT.phone}</a>
            <Link to="/book" className="btn-light text-base">Online buchen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
