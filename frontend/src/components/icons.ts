import { Droplets, Fan, Hammer, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { ServiceSlug } from "../data/demo";

export const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  plumbing: Droplets,
  cleaning: Sparkles,
  electrical: Zap,
  hvac: Fan,
  handyman: Hammer,
};
