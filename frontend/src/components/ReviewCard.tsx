import { BadgeCheck } from "lucide-react";
import { DEMO_SERVICES, type Review } from "../data/demo";
import { Stars } from "./Stars";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy">“{review.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span className="grid size-10 place-items-center rounded-full bg-navy font-display font-bold text-white">{review.name.charAt(0)}</span>
        <span>
          <span className="flex items-center gap-1 text-sm font-bold text-navy">{review.name}<BadgeCheck className="size-4 text-sky" aria-label="Verifizierter Kunde" /></span>
          <span className="block text-xs text-steel">{review.city} · {DEMO_SERVICES.find((s) => s.slug === review.service)?.name ?? review.service}</span>
        </span>
      </figcaption>
    </figure>
  );
}
