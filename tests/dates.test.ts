import { generateDaysListBack } from "../utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("generateDaysListBack", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 19, 12, 0, 0)); // Oct 19, 2026, noon local
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 30 items by default", () => {
    expect(generateDaysListBack()).toHaveLength(30);
  });

  it("returns the requested number of days", () => {
    expect(generateDaysListBack(7)).toHaveLength(7);
  });

  it("returns the dates in ascending order, ending with today", () => {
    expect(generateDaysListBack(3)).toEqual([
      "2026-10-17",
      "2026-10-18",
      "2026-10-19",
    ]);
  });

  it("starts at today minus (index - 1 ) days", () => {
    const results = generateDaysListBack();
    expect(results[0]).toEqual("2026-09-20");
    expect(results.at(-1)).toEqual("2026-10-19");
  });

  it("formats every day as YYYY-MM-DD", () => {
    generateDaysListBack(5).forEach((d) => {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("has no duplicates", () => {
    const results = generateDaysListBack();

    expect(new Set(results).size).toBe(results.length);
  });

  it("returns empty array when zero is passed", () => {
    expect(generateDaysListBack(0)).toEqual([]);
  });

  //   like Febraury
  it("crosses month boundary correctly", () => {
    vi.setSystemTime(new Date(2026, 2, 2, 12, 0, 0)); // 12 Mar 2026, noon local
    expect(generateDaysListBack(4)).toEqual([
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02",
    ]);
  });

  //   like 31 of December
  it("crosses a year boundary correctly", () => {
    vi.setSystemTime(new Date(2026, 0, 2, 12, 0, 0)); // 2 Jan 2026, noon local
    expect(generateDaysListBack(4)).toEqual([
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
      "2026-01-02",
    ]);
  });

  //   Febraury of 2028 will be 29 days not 28 days
  it("handles leap year", () => {
    vi.setSystemTime(new Date(2028, 2, 1, 12, 0, 0)); // 1 Mar 2028 , noon local
    expect(generateDaysListBack(3)).toEqual([
      "2028-02-28",
      "2028-02-29",
      "2028-03-01",
    ]);
  });
});
