import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

export default function NotFound() {
  return (
    <section className="dot-grid grid min-h-[70vh] place-items-center px-4 py-20 text-center">
      <div>
        <Construction className="mx-auto size-16 text-safety" aria-hidden />
        <h1 className="mt-6 text-6xl text-navy">404</h1>
        <p className="lead mt-3">Diese Seite braucht wohl eine Reparatur. Wir bringen Sie dorthin, wo alles funktioniert.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">Zur Startseite</Link>
          <Link to="/services" className="btn-outline">Leistungen ansehen</Link>
        </div>
      </div>
    </section>
  );
}
