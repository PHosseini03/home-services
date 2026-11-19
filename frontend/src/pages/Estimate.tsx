import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Estimator } from "../components/Estimator";
import { ZipChecker } from "../components/ZipChecker";
import { DEMO_SERVICES, type ServiceSlug } from "../data/demo";

export default function Estimate() {
  const [params] = useSearchParams();
  const wanted = params.get("service");
  const initial = DEMO_SERVICES.find((s) => s.slug === wanted)?.slug ?? ("plumbing" as ServiceSlug);
  return (
    <>
      <PageHeader eyebrow="Preisrechner" title={<>Ihr Preis in <span className="text-safety">10 Sekunden</span></>} lead="Kein Warten auf Rückruf, kein Verkaufsgespräch. Unser Preisrechner nennt Ihnen vor der Buchung eine ehrliche Preisspanne." image="/images/bathroom.jpg" />
      <section className="section">
        <div className="container-x space-y-10">
          <Estimator initialService={initial} />
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl text-navy">Prüfen Sie, ob wir bei Ihnen im Einsatz sind</h2>
            <p className="mt-1 mb-5 text-sm text-steel">Wir sind in 12 Postleitzahlgebieten in München und Umgebung im Einsatz.</p>
            <ZipChecker />
          </div>
        </div>
      </section>
    </>
  );
}
