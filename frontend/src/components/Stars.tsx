import { Star } from "lucide-react";

export function Stars({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= rating ? "fill-safety text-safety" : "text-slate-300"}`} aria-hidden />
      ))}
    </span>
  );
}
