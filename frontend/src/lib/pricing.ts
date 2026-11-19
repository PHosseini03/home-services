// Client-side mirror of the backend estimator, used only when the API is offline.
import type { ServiceSlug } from "../data/demo";

export type HomeSize = "small" | "medium" | "large" | "xl";
export type Urgency = "standard" | "next_day" | "emergency";

export interface EstimateInput {
  service: ServiceSlug;
  home_size: HomeSize;
  hours: number;
  urgency: Urgency;
}

export interface EstimateResult {
  service: ServiceSlug;
  low: number;
  high: number;
  trip_fee: number;
  hourly_rate: number;
  urgency_surcharge: number;
}

const RATES: Record<ServiceSlug, [number, number]> = {
  plumbing: [59, 79],
  electrical: [59, 85],
  hvac: [69, 89],
  handyman: [39, 55],
  cleaning: [0, 39],
};
const SIZE_FACTOR: Record<HomeSize, number> = { small: 0.85, medium: 1, large: 1.25, xl: 1.5 };
const URGENCY_FACTOR: Record<Urgency, number> = { standard: 1, next_day: 1.15, emergency: 1.5 };
const RANGE_SPREAD = 1.2;

export function estimatePrice({ service, home_size, hours, urgency }: EstimateInput): EstimateResult {
  const [tripFee, rate] = RATES[service];
  const labor = rate * hours * SIZE_FACTOR[home_size];
  const subtotal = (tripFee + labor) * URGENCY_FACTOR[urgency];
  const low = Math.round(subtotal);
  return {
    service,
    low,
    high: Math.round(low * RANGE_SPREAD),
    trip_fee: tripFee,
    hourly_rate: rate,
    urgency_surcharge: Math.round(subtotal - (tripFee + labor)),
  };
}

export const formatMoney = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
