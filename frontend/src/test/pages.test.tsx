import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { DEMO_PLANS, DEMO_REVIEWS, DEMO_SERVICES } from "../data/demo";
import { mockApi, renderAt } from "./render";

const ROUTES = { "/api/services": DEMO_SERVICES, "/api/reviews": DEMO_REVIEWS, "/api/plans": DEMO_PLANS };
const offline = () => vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

describe("routing", () => {
  it("renders the home hero and services", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /richtig repariert/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Heizung & Klima" })).toBeInTheDocument();
  });

  it("renders each main page", () => {
    offline();
    for (const [path, title] of [["/services", /jedes gewerk/i], ["/estimate", /10 sekunden/i], ["/plans", /sorgenfrei ab 9/i], ["/book", /60 sekunden/i], ["/services/hvac", /heizung & klima/i]] as const) {
      const { unmount } = renderAt(<App />, path);
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      unmount();
    }
  });

  it("shows 404 for unknown pages and unknown services", () => {
    offline();
    const { unmount } = renderAt(<App />, "/nope");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    unmount();
    renderAt(<App />, "/services/roofing");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    offline();
    renderAt(<App />);
    await userEvent.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(screen.getByRole("button", { name: /menü schließen/i })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("estimator", () => {
  it("updates the price locally when offline", async () => {
    offline();
    renderAt(<App />, "/estimate?service=electrical");
    const range = screen.getByTestId("estimate-range");
    expect(range).toHaveTextContent("229 €");
    fireEvent.change(screen.getByLabelText(/geschätzte dauer/i), { target: { value: "4" } });
    await userEvent.click(screen.getByRole("button", { name: /notfall/i }));
    expect(screen.getByRole("button", { name: /notfall/i })).toHaveAttribute("aria-pressed", "true");
    expect(range).not.toHaveTextContent("229 €");
    await userEvent.click(screen.getByRole("button", { name: /^groß/i }));
    expect(screen.getByRole("button", { name: "Haushaltsreinigung" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(screen.getByRole("button", { name: "Haushaltsreinigung" }));
    expect(screen.getByRole("button", { name: "Haushaltsreinigung" })).toHaveAttribute("aria-pressed", "true");
    expect(range).toBeInTheDocument();
  });

  it("uses the server estimate when available", async () => {
    vi.stubGlobal("fetch", mockApi({ "/api/estimate": { service: "plumbing", low: 1111, high: 2222, trip_fee: 59, hourly_rate: 79, urgency_surcharge: 0 } }));
    renderAt(<App />, "/estimate");
    await waitFor(() => expect(screen.getByTestId("estimate-range")).toHaveTextContent("1.111 €"));
  });
});

describe("zip checker", () => {
  it("validates, then checks coverage with offline fallback", async () => {
    offline();
    renderAt(<App />, "/estimate");
    const input = screen.getByLabelText("Postleitzahl");
    await userEvent.type(input, "12");
    await userEvent.click(screen.getByRole("button", { name: /gebiet prüfen/i }));
    expect(screen.getByText("Bitte geben Sie eine 5-stellige PLZ ein")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "80331");
    await userEvent.click(screen.getByRole("button", { name: /gebiet prüfen/i }));
    expect(await screen.findByText(/80331 münchen/i)).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "10115");
    await userEvent.click(screen.getByRole("button", { name: /gebiet prüfen/i }));
    expect(await screen.findByText(/in 10115 noch nicht/i)).toBeInTheDocument();
  });

  it("uses the API result", async () => {
    vi.stubGlobal("fetch", mockApi({ "/api/service-areas/check": { zip: "85737", covered: true, city: "Ismaning", eta_minutes: 50 } }));
    renderAt(<App />, "/estimate");
    await userEvent.type(screen.getByLabelText("Postleitzahl"), "85737");
    await userEvent.click(screen.getByRole("button", { name: /gebiet prüfen/i }));
    expect(await screen.findByText(/85737 ismaning/i)).toBeInTheDocument();
  });
});
