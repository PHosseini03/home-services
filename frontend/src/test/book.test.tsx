import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Book from "../pages/Book";
import { mockApi, renderAt } from "./render";

async function fillValid() {
  await userEvent.type(screen.getByLabelText("Vollständiger Name"), "Jonas Becker");
  await userEvent.type(screen.getByLabelText("Telefon"), "+49 89 1234 5678");
  await userEvent.type(screen.getByLabelText("E-Mail"), "jonas@example.com");
  await userEvent.type(screen.getByLabelText("Postleitzahl"), "80331");
  await userEvent.type(screen.getByLabelText("Straße und Hausnummer"), "Ahornstraße 88, München");
}

describe("booking form", () => {
  it("blocks submit with validation errors", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Book />);
    await userEvent.clear(screen.getByLabelText("Wunschtermin"));
    await userEvent.click(screen.getByRole("button", { name: /buchung bestätigen/i }));
    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen ein")).toBeInTheDocument();
    expect(screen.getByText("Bitte geben Sie eine 5-stellige PLZ ein")).toBeInTheDocument();
    expect(screen.getByText("Bitte wählen Sie ein Datum")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects past dates", async () => {
    vi.stubGlobal("fetch", vi.fn());
    renderAt(<Book />);
    const date = screen.getByLabelText("Wunschtermin");
    await userEvent.clear(date);
    await userEvent.type(date, "2020-01-01");
    await userEvent.click(screen.getByRole("button", { name: /buchung bestätigen/i }));
    expect(await screen.findByText("Bitte wählen Sie ein Datum in der Zukunft")).toBeInTheDocument();
  });

  it("submits valid data with prefilled service and plan", async () => {
    const fetchMock = mockApi({ "/api/bookings": { id: 12, message: "Vielen Dank, Jonas Becker! Ihr Termin ist gebucht." } });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Book />, "/book?service=hvac&plan=Komplett");
    await fillValid();
    await userEvent.click(screen.getByLabelText(/nachmittag/i));
    await userEvent.click(screen.getByRole("button", { name: /buchung bestätigen/i }));
    expect(await screen.findByText("Termin gebucht!")).toBeInTheDocument();
    expect(screen.getByText("Buchungsnr. PF-00012")).toBeInTheDocument();
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ service: "hvac", time_window: "afternoon", zip: "80331", notes: "Ich möchte den Wartungsvertrag „Komplett“ abschließen." });
    await userEvent.click(screen.getByRole("button", { name: /weiteren termin/i }));
    expect(screen.getByLabelText("Vollständiger Name")).toBeInTheDocument();
  });

  it("shows an error toast when the server rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "PLZ: Diese Postleitzahl bedienen wir leider noch nicht" }), { status: 422 })));
    renderAt(<Book />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /buchung bestätigen/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(within(screen.getByRole("alert")).getByText(/konnte nicht gebucht werden/i)).toBeInTheDocument();
  });
});
