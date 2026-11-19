import { PageHeader } from "../components/PageHeader";
import { ServiceCard } from "../components/ServiceCard";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { DEMO_SERVICES, type Service } from "../data/demo";

export default function Services() {
  const { data, loading } = useApi<Service[]>("/api/services", DEMO_SERVICES);
  return (
    <>
      <PageHeader eyebrow="Leistungen" title={<>Jedes Gewerk. <span className="text-safety">Ein Team.</span></>} lead="Installateure, Elektromeister, Heizungsbauer, zuverlässige Reinigungskräfte und geschickte Hausmeister – alles aus einer Hand." image="/images/kitchen.jpg" />
      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
          {data.map((s, i) => <Reveal key={s.slug} delay={i * 0.05}><ServiceCard service={s} /></Reveal>)}
        </div>
      </section>
    </>
  );
}
