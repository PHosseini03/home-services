import { demoResponse } from "../api/demo";

describe("demoResponse (static demo build)", () => {
  it("confirms /api/bookings like the backend does", () => {
    const result = demoResponse("/api/bookings", {"name":"Avery","service":"plumbing","date":"2026-11-24","time_window":"morning"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("Sanitär ist am 24.11.2026 (8–11 Uhr)");
    expect(result).toMatchObject({});
  });

  it("falls back to a generic confirmation for unknown endpoints and bad payloads", () => {
    const result = demoResponse("/api/unknown", null) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toBe("Vielen Dank! Ihre Anfrage ist eingegangen.");
  });
});
