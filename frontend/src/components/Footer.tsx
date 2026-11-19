import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV_LINKS } from "./Navbar";
import { CONTACT, DEMO_SERVICES } from "../data/demo";

export function Footer() {
  return (
    <footer className="bg-deep text-white/70">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed">Meisterbetrieb mit geprüften, versicherten Fachkräften für jeden Raum Ihres Zuhauses. Seit 2009 in München und Umgebung im Einsatz.</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold tracking-widest text-white uppercase">Leistungen</h2>
          <ul className="space-y-2 text-sm">
            {DEMO_SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} className="hover:text-safety">{s.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold tracking-widest text-white uppercase">Unternehmen</h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-safety">{l.label}</Link></li>)}
            <li><Link to="/book" className="hover:text-safety">Online buchen</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold tracking-widest text-white uppercase">Kontakt</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="size-4 text-safety" aria-hidden /><a href={`tel:${CONTACT.tel}`} className="hover:text-white">{CONTACT.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-safety" aria-hidden /><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-safety" aria-hidden />{CONTACT.address}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 size-4 shrink-0 text-safety" aria-hidden />{CONTACT.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-x py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} ProFix Haus-Service. Demo-Website – alle Namen, Personen und Zahlen sind fiktiv.</p>
      </div>
    </footer>
  );
}
