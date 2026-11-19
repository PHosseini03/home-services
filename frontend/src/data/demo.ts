// Fictional demo data. Mirrors the backend seed so the site works offline.
export type ServiceSlug = "plumbing" | "cleaning" | "electrical" | "hvac" | "handyman";

export interface Service {
  slug: ServiceSlug;
  name: string;
  tagline: string;
  description: string;
  price_from: number;
  image: string;
  features: string[];
}

export interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  service: ServiceSlug;
  text: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
  featured: boolean;
}

export interface Area {
  zip: string;
  city: string;
  eta_minutes: number;
}

export const DEMO_SERVICES: Service[] = [
  { slug: "plumbing", name: "Sanitär", tagline: "Lecks, Verstopfungen & Warmwasser", description: "Meisterbetrieb für Rohrbrüche, Abflüsse, Boiler, Armaturen und komplette Leitungssanierung. Festpreis vor Arbeitsbeginn.", price_from: 59, image: "/images/plumbing.jpg", features: ["Leckortung & Reparatur", "Rohr- & Kanalreinigung", "Boiler- & Durchlauferhitzer-Montage", "Armaturen & Bad-Upgrades"] },
  { slug: "cleaning", name: "Haushaltsreinigung", tagline: "Blitzsauber, jedes Mal", description: "Geprüfte Reinigungskräfte für regelmäßige Unterhaltsreinigung, Grundreinigung und Endreinigung beim Auszug. Umweltfreundliche Mittel inklusive.", price_from: 89, image: "/images/cleaning.jpg", features: ["Wöchentlich oder alle zwei Wochen", "Grund- & Endreinigung", "Umweltfreundliche Mittel", "Immer dasselbe Team"] },
  { slug: "electrical", name: "Elektrik", tagline: "Sicher und nach VDE-Norm", description: "Elektromeister für Sicherungskästen, Steckdosen, Beleuchtung, Wallboxen und E-Checks für das ganze Haus.", price_from: 59, image: "/images/electrical.jpg", features: ["Zählerschrank-Modernisierung", "Beleuchtung & Deckenventilatoren", "Wallbox-Installation", "E-Check & Sicherheitsprüfung"] },
  { slug: "hvac", name: "Heizung & Klima", tagline: "Wohlfühlklima zu jeder Jahreszeit", description: "Reparatur und Wartung von Heizung und Klimaanlage sowie effiziente Neuanlagen und Wärmepumpen – Finanzierung möglich.", price_from: 69, image: "/images/hvac.jpg", features: ["Heizungs- & Klimareparatur", "Jährliche Wartung", "Wärmepumpen & Effizienzanlagen", "Raumluftqualität"] },
  { slug: "handyman", name: "Hausmeisterservice", tagline: "Ihre To-do-Liste, erledigt", description: "Montage, Möbelaufbau, Trockenbau, Türen, Malerausbesserungen und all die kleinen Arbeiten, die liegen bleiben.", price_from: 39, image: "/images/handyman.jpg", features: ["TV- & Regalmontage", "Möbelaufbau", "Trockenbau & Malerarbeiten", "Tür- & Fensterreparaturen"] },
];

const SHY = "­";

/** Short labels for tight tiles; soft hyphens let long German words break cleanly. */
export const SHORT_NAMES: Record<ServiceSlug, string> = {
  plumbing: "Sanitär",
  cleaning: `Reini${SHY}gung`,
  electrical: "Elektrik",
  hvac: "Heizung",
  handyman: `Haus${SHY}meister`,
};

export const DEMO_REVIEWS: Review[] = [
  { id: 1, name: "Maria G.", city: "Unterhaching", rating: 5, service: "plumbing", text: "Boiler am Sonntag kaputt – um 16 Uhr war ein neuer eingebaut. Klarer Festpreis vorab, keine Überraschungen." },
  { id: 2, name: "Dirk W.", city: "Ismaning", rating: 5, service: "cleaning", text: "Alle zwei Wochen dieselben zwei Reinigungskräfte – die Wohnung sah nie besser aus. Jeden Euro wert." },
  { id: 3, name: "Petra S.", city: "Ottobrunn", rating: 5, service: "electrical", text: "Neuer Zählerschrank und Wallbox an einem Termin. Der Elektriker hat alles erklärt und null Dreck hinterlassen." },
  { id: 4, name: "Thomas & Elke R.", city: "Planegg", rating: 5, service: "hvac", text: "Heizung fiel mitten im Januar aus. Der Techniker war in 90 Minuten da und nach einer Stunde lief alles wieder." },
  { id: 5, name: "Julia K.", city: "München", rating: 4, service: "handyman", text: "Zwei Fernseher montiert, eine klemmende Tür repariert und Wände ausgebessert – alles bei einem Besuch. Super effizient." },
  { id: 6, name: "Christian P.", city: "Gauting", rating: 5, service: "plumbing", text: "Hat ein verstecktes Leck unter dem Estrich gefunden, das andere Firmen übersehen hatten. Hat uns Tausende gespart." },
];

export const DEMO_PLANS: Plan[] = [
  { id: 1, name: "Basis", price: 9, features: ["Jährlicher Sanitär-Check", "10 % auf alle Reparaturen", "Keine Anfahrtskosten"], featured: false },
  { id: 2, name: "Komplett", price: 19, features: ["2 Heizungswartungen pro Jahr", "Jährlicher Sanitär- & Elektro-Check", "15 % auf alle Reparaturen", "Bevorzugte Terminvergabe", "Keine Anfahrtskosten"], featured: true },
  { id: 3, name: "Premium", price: 29, features: ["Alles aus Komplett", "Vierteljährliche Grundreinigung", "20 % auf alle Reparaturen", "24/7-Notdienst ohne Zuschlag"], featured: false },
];

export const DEMO_AREAS: Area[] = [
  { zip: "82131", city: "Gauting", eta_minutes: 55 }, { zip: "85737", city: "Ismaning", eta_minutes: 50 },
  { zip: "80331", city: "München", eta_minutes: 35 }, { zip: "80469", city: "München", eta_minutes: 35 },
  { zip: "80637", city: "München", eta_minutes: 35 }, { zip: "80799", city: "München", eta_minutes: 40 },
  { zip: "81369", city: "München", eta_minutes: 40 }, { zip: "81667", city: "München", eta_minutes: 40 },
  { zip: "85521", city: "Ottobrunn", eta_minutes: 45 }, { zip: "82152", city: "Planegg", eta_minutes: 50 },
  { zip: "82008", city: "Unterhaching", eta_minutes: 45 }, { zip: "85716", city: "Unterschleißheim", eta_minutes: 50 },
];

export const CONTACT = {
  phone: "Ihre Telefonnummer hier",
  tel: "",
  email: "hilfe@profix.example",
  address: "Ihre Adresse hier",
  hours: "Mo–Sa 7–20 Uhr · Notdienst rund um die Uhr",
};
