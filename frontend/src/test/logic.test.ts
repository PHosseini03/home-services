import { describe, expect, it, vi } from "vitest";
import { estimatePrice, formatMoney } from "../lib/pricing";
import { rules, validate } from "../lib/validation";
import { api, ApiError, request } from "../api/client";

describe("estimatePrice", () => {
  it("matches the backend formula for a known input", () => {
    expect(estimatePrice({ service: "plumbing", home_size: "medium", hours: 2, urgency: "standard" })).toEqual({
      service: "plumbing", low: 217, high: 260, trip_fee: 59, hourly_rate: 79, urgency_surcharge: 0,
    });
  });

  it("adds an urgency surcharge and scales with home size", () => {
    const base = estimatePrice({ service: "hvac", home_size: "medium", hours: 3, urgency: "standard" });
    const urgent = estimatePrice({ service: "hvac", home_size: "medium", hours: 3, urgency: "emergency" });
    const big = estimatePrice({ service: "hvac", home_size: "xl", hours: 3, urgency: "standard" });
    expect(urgent.low).toBeGreaterThan(base.low);
    expect(urgent.urgency_surcharge).toBeGreaterThan(0);
    expect(big.low).toBeGreaterThan(base.low);
  });

  it("cleaning has no trip fee", () => {
    expect(estimatePrice({ service: "cleaning", home_size: "small", hours: 3, urgency: "standard" }).trip_fee).toBe(0);
  });

  it("formats money", () => {
    expect(formatMoney(1234)).toBe("1.234\u00a0€");
  });
});

describe("validate", () => {
  const schema = { name: [rules.name], email: [rules.email], phone: [rules.phone], n: [rules.number("N", 1, 5)], note: [rules.safeText] };

  it("passes valid values", () => {
    expect(validate({ name: "Jonas Becker", email: "j@example.com", phone: "+49 89 1234 5678", n: "3", note: "ok" }, schema)).toEqual({});
  });

  it("reports invalid fields", () => {
    const errors = validate({ name: "<b>", email: "x", phone: "abc", n: "9", note: "<i>" }, schema);
    expect(Object.keys(errors).sort()).toEqual(["email", "n", "name", "note", "phone"]);
    expect(rules.required("Ort")("")).toBe("Ort ist ein Pflichtfeld");
  });
});

describe("api client", () => {
  it("unwraps a successful envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: 5, error: null }))));
    await expect(api.get<number>("/api/x")).resolves.toBe(5);
  });

  it("throws server errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "PLZ: ungültig" }), { status: 422 })));
    await expect(api.post("/api/x", {})).rejects.toThrow("PLZ: ungültig");
  });

  it("flags network failures and non-JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const err = await request("/api/x").catch((e: unknown) => e);
    expect((err as ApiError).isNetwork).toBe(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 502 })));
    await expect(request("/api/x")).rejects.toThrow("unerwartete Antwort");
  });
});
