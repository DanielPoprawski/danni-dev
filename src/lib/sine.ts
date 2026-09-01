/**
 * Pure math for the scroll-driven sine falloff. No DOM access — this file is
 * directly unit-testable, which is what locks the edge cases down permanently.
 */

export type SineConfig = {
  /** Travel window half-height as a multiple of viewport height. */
  readonly range: number;
  /** Sections never fully vanish. */
  readonly minOpacity: number;
  /**
   * Gamma applied to the opacity curve. A raw sine puts a lot of on-screen text
   * below 4.5:1 contrast; a gamma below 1 produces a broad plateau near full
   * opacity and only dives once the section is mostly off-screen. Scale keeps
   * the pure sine, so the *motion* still reads as unmistakably sinusoidal.
   */
  readonly opacityGamma: number;
  readonly minScale: number;
  /** Capped near 1 — text scaled much past this goes GPU-soft and can overflow. */
  readonly maxScale: number;
};

export const DEFAULT_SINE_CONFIG: SineConfig = {
  range: 1,
  minOpacity: 0.12,
  opacityGamma: 0.4,
  minScale: 0.92,
  maxScale: 1.04,
};

export type SineInput = {
  /** rect.top of the UNTRANSFORMED measurement wrapper. */
  readonly elementTop: number;
  readonly elementHeight: number;
  readonly viewportHeight: number;
  /** Already clamped to [0, maxScrollY] by the caller. */
  readonly scrollY: number;
  readonly maxScrollY: number;
  readonly range: number;
};

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Normalised position, where 0.5 means "as centred as this page's scroll extent
 * actually allows".
 *
 * The reachability clamp is the load-bearing part. A naive sine leaves the first
 * section permanently dim (nothing above it to scroll, so it can never reach the
 * viewport centre) and the last section likewise — precisely the two moments a
 * reader is most likely to be looking. Rather than padding 50vh of dead space
 * above and below, we cap the distance-from-centre by the distance the user
 * could actually scroll away: if you can't scroll far enough to centre this
 * element, it isn't penalised for the distance you cannot remove.
 *
 * The clamp is one-sided at each end — at scroll top, a section *below* centre
 * is still penalised, because you can in fact scroll down to centre it.
 */
export function sineProgress(input: SineInput): number {
  const distance = input.elementTop + input.elementHeight / 2 - input.viewportHeight / 2;
  const reachable = clamp(distance, -input.scrollY, input.maxScrollY - input.scrollY);
  const halfTravel = (input.viewportHeight * input.range + input.elementHeight) / 2;
  if (halfTravel <= 0) return 0.5;
  return clamp(0.5 + reachable / (2 * halfTravel), 0, 1);
}

/** sin(pi * t), peaking at 1.0 when t === 0.5. */
export function sineAmplitude(t: number): number {
  return Math.sin(Math.PI * t);
}

export type SineOutput = {
  /** Raw amplitude, drives scale. */
  readonly amplitude: number;
  /** Gamma-corrected opacity, already in [minOpacity, 1]. */
  readonly opacity: number;
  /** Signed -1..1 offset from centre, drives the parallax shift. */
  readonly direction: number;
};

export function sineOutput(t: number, config: SineConfig): SineOutput {
  // Floor at 0: sin(pi) leaves ~1e-16 of float residue, and a negative base
  // would make Math.pow return NaN and blank the section.
  const amplitude = Math.max(0, sineAmplitude(t));
  return {
    amplitude,
    opacity: config.minOpacity + (1 - config.minOpacity) * Math.pow(amplitude, config.opacityGamma),
    direction: (t - 0.5) * 2,
  };
}
