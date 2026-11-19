import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, Phone, Siren, Wrench, X } from "lucide-react";
import { CONTACT } from "../data/demo";

export const NAV_LINKS = [
  { to: "/", label: "Start" },
  { to: "/services", label: "Leistungen" },
  { to: "/estimate", label: "Preisrechner" },
  { to: "/plans", label: "Wartungsverträge" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-display text-xl font-extrabold ${light ? "text-white" : "text-navy"}`} aria-label="ProFix Haus-Service – Startseite">
      <span className="grid size-10 place-items-center rounded-xl bg-safety text-white shadow-[0_3px_0_var(--color-safety-dark)]">
        <Wrench className="size-5" strokeWidth={2.75} aria-hidden />
      </span>
      <span>Pro<span className="text-safety">Fix</span></span>
    </Link>
  );
}

function EmergencyBar() {
  return (
    <div className="stripes bg-navy text-white">
      <div className="container-x flex h-10 items-center justify-between gap-3 text-xs font-semibold sm:text-sm">
        <p className="flex items-center gap-2">
          <Siren className="size-4 text-safety" aria-hidden />
          <span className="hidden sm:inline">Notdienst rund um die Uhr: Sanitär, Elektrik & Heizung.</span>
          <span className="sm:hidden">24/7-Notdienst</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-white/70 md:flex"><Clock className="size-3.5" aria-hidden />{CONTACT.hours}</span>
          <a href={`tel:${CONTACT.tel}`} className="flex items-center gap-1.5 rounded-md bg-safety px-2.5 py-1 font-bold hover:bg-safety-dark">
            <Phone className="size-3.5" aria-hidden /> {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-12 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-safety focus:px-4 focus:py-2 focus:text-white">Zum Inhalt springen</a>
      <EmergencyBar />
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="container-x flex h-18 items-center justify-between" aria-label="Hauptnavigation">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? "bg-navy/5 text-safety" : "text-navy hover:text-safety"}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/book" className="btn-primary hidden !py-3 lg:inline-flex">Profi buchen</Link>
          <button type="button" className="grid size-11 place-items-center rounded-xl border-2 border-navy/15 text-navy lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menü schließen" : "Menü öffnen"}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-200 lg:hidden">
              <ul className="container-x flex flex-col gap-1 py-4">
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-bold ${isActive ? "bg-safety/10 text-safety-dark" : "text-navy"}`}>{l.label}</NavLink>
                  </li>
                ))}
                <li className="grid grid-cols-2 gap-2 pt-2">
                  <a href={`tel:${CONTACT.tel}`} className="btn-navy"><Phone className="size-4" aria-hidden />Jetzt anrufen</a>
                  <Link to="/book" className="btn-primary">Profi buchen</Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
