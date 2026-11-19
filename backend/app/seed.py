"""Create tables and seed fictional demo data."""
import json
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS services (
    slug TEXT PRIMARY KEY, name TEXT NOT NULL, tagline TEXT NOT NULL, description TEXT NOT NULL,
    price_from INTEGER NOT NULL, image TEXT NOT NULL, features TEXT NOT NULL, position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, rating INTEGER NOT NULL,
    service TEXT NOT NULL, text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, features TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS service_areas (
    zip TEXT PRIMARY KEY, city TEXT NOT NULL, eta_minutes INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    service TEXT NOT NULL, date TEXT NOT NULL, time_window TEXT NOT NULL, zip TEXT NOT NULL,
    address TEXT NOT NULL, notes TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

SERVICES = [
    ("plumbing", "Sanitär", "Lecks, Verstopfungen & Warmwasser",
     "Meisterbetrieb für Rohrbrüche, Abflüsse, Boiler, Armaturen und komplette Leitungssanierung. Festpreis vor Arbeitsbeginn.",
     59, "/images/plumbing.jpg", ["Leckortung & Reparatur", "Rohr- & Kanalreinigung", "Boiler- & Durchlauferhitzer-Montage", "Armaturen & Bad-Upgrades"], 1),
    ("cleaning", "Haushaltsreinigung", "Blitzsauber, jedes Mal",
     "Geprüfte Reinigungskräfte für regelmäßige Unterhaltsreinigung, Grundreinigung und Endreinigung beim Auszug. Umweltfreundliche Mittel inklusive.",
     89, "/images/cleaning.jpg", ["Wöchentlich oder alle zwei Wochen", "Grund- & Endreinigung", "Umweltfreundliche Mittel", "Immer dasselbe Team"], 2),
    ("electrical", "Elektrik", "Sicher und nach VDE-Norm",
     "Elektromeister für Sicherungskästen, Steckdosen, Beleuchtung, Wallboxen und E-Checks für das ganze Haus.",
     59, "/images/electrical.jpg", ["Zählerschrank-Modernisierung", "Beleuchtung & Deckenventilatoren", "Wallbox-Installation", "E-Check & Sicherheitsprüfung"], 3),
    ("hvac", "Heizung & Klima", "Wohlfühlklima zu jeder Jahreszeit",
     "Reparatur und Wartung von Heizung und Klimaanlage sowie effiziente Neuanlagen und Wärmepumpen – Finanzierung möglich.",
     69, "/images/hvac.jpg", ["Heizungs- & Klimareparatur", "Jährliche Wartung", "Wärmepumpen & Effizienzanlagen", "Raumluftqualität"], 4),
    ("handyman", "Hausmeisterservice", "Ihre To-do-Liste, erledigt",
     "Montage, Möbelaufbau, Trockenbau, Türen, Malerausbesserungen und all die kleinen Arbeiten, die liegen bleiben.",
     39, "/images/handyman.jpg", ["TV- & Regalmontage", "Möbelaufbau", "Trockenbau & Malerarbeiten", "Tür- & Fensterreparaturen"], 5),
]

REVIEWS = [
    (1, "Maria G.", "Unterhaching", 5, "plumbing", "Boiler am Sonntag kaputt – um 16 Uhr war ein neuer eingebaut. Klarer Festpreis vorab, keine Überraschungen."),
    (2, "Dirk W.", "Ismaning", 5, "cleaning", "Alle zwei Wochen dieselben zwei Reinigungskräfte – die Wohnung sah nie besser aus. Jeden Euro wert."),
    (3, "Petra S.", "Ottobrunn", 5, "electrical", "Neuer Zählerschrank und Wallbox an einem Termin. Der Elektriker hat alles erklärt und null Dreck hinterlassen."),
    (4, "Thomas & Elke R.", "Planegg", 5, "hvac", "Heizung fiel mitten im Januar aus. Der Techniker war in 90 Minuten da und nach einer Stunde lief alles wieder."),
    (5, "Julia K.", "München", 4, "handyman", "Zwei Fernseher montiert, eine klemmende Tür repariert und Wände ausgebessert – alles bei einem Besuch. Super effizient."),
    (6, "Christian P.", "Gauting", 5, "plumbing", "Hat ein verstecktes Leck unter dem Estrich gefunden, das andere Firmen übersehen hatten. Hat uns Tausende gespart."),
]

PLANS = [
    (1, "Basis", 9, ["Jährlicher Sanitär-Check", "10 % auf alle Reparaturen", "Keine Anfahrtskosten"], 0),
    (2, "Komplett", 19, ["2 Heizungswartungen pro Jahr", "Jährlicher Sanitär- & Elektro-Check", "15 % auf alle Reparaturen", "Bevorzugte Terminvergabe", "Keine Anfahrtskosten"], 1),
    (3, "Premium", 29, ["Alles aus Komplett", "Vierteljährliche Grundreinigung", "20 % auf alle Reparaturen", "24/7-Notdienst ohne Zuschlag"], 0),
]

AREAS = [
    ("80331", "München", 35), ("80469", "München", 35), ("80799", "München", 40), ("81667", "München", 40),
    ("80637", "München", 35), ("81369", "München", 40), ("85716", "Unterschleißheim", 50), ("85737", "Ismaning", 50),
    ("82008", "Unterhaching", 45), ("82131", "Gauting", 55), ("85521", "Ottobrunn", 45), ("82152", "Planegg", 50),
]


def seed(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM services").fetchone()[0] == 0:
        conn.executemany(
            "INSERT INTO services VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [(s[0], s[1], s[2], s[3], s[4], s[5], json.dumps(s[6]), s[7]) for s in SERVICES],
        )
        conn.executemany("INSERT INTO reviews VALUES (?, ?, ?, ?, ?, ?)", REVIEWS)
        conn.executemany(
            "INSERT INTO plans VALUES (?, ?, ?, ?, ?)",
            [(p[0], p[1], p[2], json.dumps(p[3]), p[4]) for p in PLANS],
        )
        conn.executemany("INSERT INTO service_areas VALUES (?, ?, ?)", AREAS)
    conn.commit()
