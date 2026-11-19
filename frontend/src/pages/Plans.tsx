import { PageHeader } from "../components/PageHeader";
import { PlanCards } from "../components/PlanCards";
import { DEMO_PLANS } from "../data/demo";
import { formatMoney } from "../lib/pricing";

const PERKS = [
  { title: "Probleme früh erkennen", text: "Jährliche Checks finden kleine Lecks und verschlissene Teile, bevor daraus ein Notfall wird." },
  { title: "Ohne Warteschlange", text: "Mitglieder erhalten bevorzugt Termine – auch bei Hitzewellen und Frost." },
  { title: "Jederzeit kündbar", text: "Keine Mindestlaufzeit. Pausieren oder kündigen Sie mit einem Klick." },
];

export default function Plans() {
  return (
    <>
      <PageHeader eyebrow="Wartungsverträge" title={<>Sorgenfrei ab <span className="text-safety">{formatMoney(DEMO_PLANS[0].price)}/Monat</span></>} lead="Regelmäßige Wartung, Mitgliederrabatte und keine Anfahrtskosten. Die meisten Mitglieder sparen schon im ersten Jahr mehr, als der Vertrag kostet." image="/images/house.jpg" />
      <section className="section">
        <div className="container-x">
          <PlanCards />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {PERKS.map((p) => (
              <div key={p.title} className="card p-6">
                <h2 className="text-lg text-navy">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-steel">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
