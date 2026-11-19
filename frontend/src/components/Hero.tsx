import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Star, Truck } from "lucide-react";
import { DEMO_SERVICES, SHORT_NAMES } from "../data/demo";
import { SERVICE_ICONS } from "./icons";

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden">
      <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-20">
        <div>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chip">
            <Clock3 className="size-3.5" aria-hidden /> Heute noch Termine frei
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-5 text-5xl leading-[0.98] text-navy sm:text-6xl lg:text-7xl">
            Richtig repariert.<br />
            <span className="relative inline-block text-safety">
              Beim ersten Mal.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden><path d="M2 9C80 2 220 2 298 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" /></svg>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="lead mt-7 max-w-xl">
            Sanitär, Elektrik, Heizung & Klima, Haushaltsreinigung und Hausmeisterservice vom geprüften Meisterbetrieb. Festpreise vorab. Keine Überraschungen.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 grid grid-cols-5 gap-2 sm:max-w-lg">
            {DEMO_SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.slug];
              return (
                <Link key={s.slug} to={`/services/${s.slug}`} className="group flex flex-col items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-1 py-3 text-center transition hover:border-safety">
                  <Icon className="size-6 text-navy transition group-hover:text-safety" aria-hidden />
                  <span className="w-full text-[11px] leading-tight font-bold [overflow-wrap:anywhere] hyphens-auto text-navy sm:text-xs">{SHORT_NAMES[s.slug]}</span>
                </Link>
              );
            })}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/book" className="btn-primary text-base">Profi buchen <ArrowRight className="size-4" aria-hidden /></Link>
            <Link to="/estimate" className="btn-outline text-base">Sofort Preis berechnen</Link>
          </motion.div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy">
            <li className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-safety" aria-hidden />Meisterbetrieb & versichert</li>
            <li className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-safety" aria-hidden />Geprüfte Fachkräfte</li>
            <li className="flex items-center gap-1.5"><Star className="size-4 fill-safety text-safety" aria-hidden />4,9 · 3.100 Bewertungen</li>
          </ul>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -top-4 -right-4 hidden h-full w-full rounded-3xl bg-safety sm:block" aria-hidden />
          <img src="/images/hero.jpg" alt="ProFix-Elektriker mit Schutzhelm bereit für den Einsatz" className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl sm:aspect-[5/6]" fetchPriority="high" />
          <div className="card absolute bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:-left-8">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-500 text-white"><Truck className="size-5" aria-hidden /></span>
            <div>
              <p className="text-xs text-steel">Markus ist unterwegs</p>
              <p className="font-display text-lg font-extrabold text-navy">Ankunft in 38 Min.</p>
            </div>
          </div>
          <div className="absolute top-5 right-4 rounded-2xl bg-navy px-4 py-3 text-white shadow-xl sm:-right-6">
            <p className="font-display text-3xl font-extrabold">15+</p>
            <p className="text-xs text-white/70">Jahre in München</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
