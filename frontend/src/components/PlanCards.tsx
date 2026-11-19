import { Link } from "react-router-dom";
import { Check, Crown } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { DEMO_PLANS, type Plan } from "../data/demo";
import { formatMoney } from "../lib/pricing";
import { Reveal } from "./Reveal";

export function PlanCards() {
  const { data: plans, loading } = useApi<Plan[]>("/api/plans", DEMO_PLANS);
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-busy={loading}>
      {plans.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.06}>
          <article className={`relative flex h-full flex-col rounded-2xl border-2 p-7 ${p.featured ? "border-safety bg-navy text-white shadow-2xl shadow-navy/30" : "border-slate-200 bg-white text-navy"}`}>
            {p.featured && <span className="absolute -top-3.5 left-7 inline-flex items-center gap-1 rounded-md bg-safety px-3 py-1 text-xs font-bold text-white"><Crown className="size-3.5" aria-hidden />Bestes Angebot</span>}
            <h3 className="text-2xl">{p.name}</h3>
            <p className="mt-4 flex items-end gap-1">
              <span className="font-display text-5xl font-extrabold">{formatMoney(p.price)}</span>
              <span className={`pb-1.5 text-sm ${p.featured ? "text-white/60" : "text-steel"}`}>/Monat</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-safety" strokeWidth={3} aria-hidden />{f}</li>
              ))}
            </ul>
            <Link to={`/book?plan=${encodeURIComponent(p.name)}`} className={`${p.featured ? "btn-primary" : "btn-outline"} mt-8 w-full`}>{p.name} wählen</Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
