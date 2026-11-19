import { Link, useParams } from "react-router-dom";
import { CalendarCheck, Check, Phone } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Estimator } from "../components/Estimator";
import { ReviewCard } from "../components/ReviewCard";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { CONTACT, DEMO_REVIEWS, DEMO_SERVICES, type Review, type Service } from "../data/demo";
import { formatMoney } from "../lib/pricing";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const { data: services } = useApi<Service[]>("/api/services", DEMO_SERVICES);
  const { data: reviews } = useApi<Review[]>("/api/reviews", DEMO_REVIEWS);
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;
  const related = reviews.filter((r) => r.service === service.slug);

  return (
    <>
      <PageHeader eyebrow={service.tagline} title={service.name} lead={service.description} image={service.image}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/book?service=${service.slug}`} className="btn-primary"><CalendarCheck className="size-4" aria-hidden />{service.name} buchen</Link>
          <a href={`tel:${CONTACT.tel}`} className="btn-light"><Phone className="size-4" aria-hidden />{CONTACT.phone}</a>
        </div>
      </PageHeader>
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img src={service.image} alt={`${service.name}: Arbeit einer ProFix-Fachkraft`} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
          </Reveal>
          <Reveal delay={0.08}>
            <span className="eyebrow">Das übernehmen wir</span>
            <h2 className="heading mt-3">{service.name} – richtig gemacht</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="card flex items-center gap-3 p-4 text-sm font-bold text-navy"><Check className="size-5 shrink-0 text-safety" strokeWidth={3} aria-hidden />{f}</li>
              ))}
            </ul>
            <p className="mt-6 text-steel">Einsätze ab <strong className="font-display text-2xl text-navy">{formatMoney(service.price_from)}</strong> inklusive Fehlerdiagnose.</p>
          </Reveal>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <Reveal className="mb-8 text-center"><span className="eyebrow">Preisrechner</span><h2 className="heading mt-3">Preis berechnen: {service.name}</h2></Reveal>
          <Estimator key={service.slug} initialService={service.slug} />
        </div>
      </section>
      {related.length > 0 && (
        <section className="section">
          <div className="container-x">
            <h2 className="heading text-center">Das sagen unsere Kunden</h2>
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
              {related.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
