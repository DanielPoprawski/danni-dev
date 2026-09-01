import { test, expect, describe } from "bun:test";
import { DEFAULT_SINE_CONFIG, clamp, sineAmplitude, sineOutput, sineProgress } from "./sine";

const VH = 900;
const MAX_SCROLL = 5000;

function progress(overrides: Partial<Parameters<typeof sineProgress>[0]>): number {
  return sineProgress({
    elementTop: 0,
    elementHeight: 400,
    viewportHeight: VH,
    scrollY: 2000,
    maxScrollY: MAX_SCROLL,
    range: 1,
    ...overrides,
  });
}

describe("clamp", () => {
  test("bounds in both directions", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});

describe("sineProgress", () => {
  test("a perfectly centred section reads exactly 0.5", () => {
    // centre of element == centre of viewport
    const elementTop = VH / 2 - 400 / 2;
    expect(progress({ elementTop })).toBeCloseTo(0.5, 10);
  });

  test("stays within [0,1] far outside the travel window", () => {
    expect(progress({ elementTop: -100000 })).toBe(0);
    expect(progress({ elementTop: 100000 })).toBe(1);
  });

  test("is monotonic in elementTop", () => {
    const a = progress({ elementTop: -200 });
    const b = progress({ elementTop: 0 });
    const c = progress({ elementTop: 200 });
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  // The two edge cases a naive sine gets wrong.
  test("at scroll top, every section above centre is fully amplified", () => {
    const t = progress({ scrollY: 0, elementTop: 0 });
    expect(t).toBeCloseTo(0.5, 10);
    expect(sineAmplitude(t)).toBeCloseTo(1, 10);
  });

  test("at scroll bottom, every section below centre is fully amplified", () => {
    const t = progress({ scrollY: MAX_SCROLL, elementTop: VH });
    expect(t).toBeCloseTo(0.5, 10);
    expect(sineAmplitude(t)).toBeCloseTo(1, 10);
  });

  test("at scroll top a section BELOW centre is still penalised", () => {
    // You can still scroll down to centre it, so it must not be clamped.
    const t = progress({ scrollY: 0, elementTop: VH });
    expect(t).toBeGreaterThan(0.5);
  });

  test("degenerate viewport does not divide by zero", () => {
    expect(progress({ viewportHeight: 0, elementHeight: 0 })).toBe(0.5);
  });
});

describe("sineOutput", () => {
  test("centred section is fully opaque at max scale input", () => {
    const out = sineOutput(0.5, DEFAULT_SINE_CONFIG);
    expect(out.amplitude).toBeCloseTo(1, 10);
    expect(out.opacity).toBeCloseTo(1, 10);
    expect(out.direction).toBeCloseTo(0, 10);
  });

  test("opacity never drops below the configured floor", () => {
    // Precision 5, not 10: sin(pi) carries ~1e-16 of float residue, which the
    // gamma amplifies to ~4e-7. Harmless, but real.
    expect(sineOutput(0, DEFAULT_SINE_CONFIG).opacity).toBeCloseTo(
      DEFAULT_SINE_CONFIG.minOpacity,
      5,
    );
    expect(sineOutput(1, DEFAULT_SINE_CONFIG).opacity).toBeCloseTo(
      DEFAULT_SINE_CONFIG.minOpacity,
      5,
    );
  });

  test("never produces NaN across the whole domain", () => {
    for (let i = 0; i <= 100; i++) {
      const out = sineOutput(i / 100, DEFAULT_SINE_CONFIG);
      expect(Number.isFinite(out.opacity)).toBe(true);
      expect(Number.isFinite(out.amplitude)).toBe(true);
      expect(Number.isFinite(out.direction)).toBe(true);
    }
  });

  test("gamma keeps partially-visible text well above the raw sine", () => {
    // A section half out of frame should stay comfortably readable.
    const t = 0.75;
    const out = sineOutput(t, DEFAULT_SINE_CONFIG);
    expect(out.opacity).toBeGreaterThan(sineAmplitude(t));
    expect(out.opacity).toBeGreaterThan(0.8);
  });

  test("direction is signed and symmetric", () => {
    expect(sineOutput(0, DEFAULT_SINE_CONFIG).direction).toBeCloseTo(-1, 10);
    expect(sineOutput(1, DEFAULT_SINE_CONFIG).direction).toBeCloseTo(1, 10);
  });
});
