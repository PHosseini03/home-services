import { demoResponse } from "../api/demo";
import { estimatePrice } from "../lib/pricing";

describe("demo price estimate", () => {
  it("returns the full estimator result so the page can render it", () => {
    const input = { service: "plumbing" as const, home_size: "medium" as const, hours: 2, urgency: "standard" as const };
    expect(demoResponse("/api/estimate", input)).toEqual(estimatePrice(input));
  });
});
