import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "../data/demo";
import { formatMoney } from "../lib/pricing";
import { SERVICE_ICONS } from "./icons";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = SERVICE_ICONS[service.slug];
  return (
    <Link to={`/services/${service.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-safety">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={service.image} alt={`${service.name}: Fachkraft im Einsatz`} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute top-3 left-3 grid size-11 place-items-center rounded-xl bg-safety text-white shadow-lg"><Icon className="size-5" aria-hidden /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl text-navy">{service.name}</h3>
        <p className="mt-1 text-sm text-steel">{service.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-sm text-steel">ab <strong className="font-display text-lg text-navy">{formatMoney(service.price_from)}</strong></span>
          <span className="grid size-9 place-items-center rounded-full bg-navy text-white transition group-hover:bg-safety"><ArrowUpRight className="size-4" aria-hidden /></span>
        </div>
      </div>
    </Link>
  );
}
