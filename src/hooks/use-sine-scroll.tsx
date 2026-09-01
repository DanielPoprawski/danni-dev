import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DEFAULT_SINE_CONFIG, clamp, sineOutput, sineProgress } from "@/lib/sine";

/**
 * Scroll-driven sine falloff, shared across every registered section.
 *
 * One scroll listener, one rAF, one forced layout per frame. Per-frame values
 * are written straight to the DOM as custom properties — routing them through
 * React state would reconcile every section on every frame.
 *
 * Two elements per section, deliberately: the outer wrapper is *measured* and
 * stays untransformed in normal flow, the inner child is *transformed*. Sharing
 * one node would feed the parallax translate back into the next frame's
 * measurement, producing an oscillating loop.
 *
 * Only `transform` and `opacity` are ever written. Both are compositor-only, so
 * the effect cannot trigger layout and cannot contribute to CLS.
 */

const CONFIG = DEFAULT_SINE_CONFIG;

type Subscription = {
  readonly id: string;
  readonly measure: HTMLElement;
  readonly animate: HTMLElement;
};

type SineContextValue = {
  readonly subscribe: (subscription: Subscription) => () => void;
  readonly activeId: string | null;
  readonly scrollToSection: (id: string) => void;
  readonly reducedMotion: boolean;
};

const SineContext = createContext<SineContextValue | null>(null);

export function SineScrollProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<string, Subscription>());
  const frame = useRef<number | null>(null);
  const viewportHeight = useRef(0);
  const maxScrollY = useRef(0);
  const activeIdRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  /** scrollHeight is a layout read — cache it, never read it in the write phase. */
  const measureViewport = useCallback(() => {
    viewportHeight.current = window.innerHeight;
    maxScrollY.current = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  }, []);

  const runPass = useCallback(() => {
    frame.current = null;

    const vh = viewportHeight.current;
    const maxY = maxScrollY.current;
    // Safari rubber-banding drives scrollY negative and past the maximum, which
    // would invert the reachability clamp.
    const y = clamp(window.scrollY, 0, maxY);
    const isReduced = reducedMotionRef.current;

    // Read phase — every measurement before any write, so nothing can force a
    // synchronous reflow mid-loop.
    const measured: Array<{ id: string; animate: HTMLElement; t: number }> = [];
    for (const subscription of registry.current.values()) {
      const rect = subscription.measure.getBoundingClientRect();
      measured.push({
        id: subscription.id,
        animate: subscription.animate,
        t: sineProgress({
          elementTop: rect.top,
          elementHeight: rect.height,
          viewportHeight: vh,
          scrollY: y,
          maxScrollY: maxY,
          range: CONFIG.range,
        }),
      });
    }

    // Write phase.
    let bestId: string | null = null;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (const entry of measured) {
      if (!isReduced) {
        const out = sineOutput(entry.t, CONFIG);
        const style = entry.animate.style;
        style.setProperty("--sine-a", out.amplitude.toFixed(4));
        style.setProperty("--sine-o", out.opacity.toFixed(4));
        style.setProperty("--sine-d", out.direction.toFixed(4));
      }
      const delta = Math.abs(entry.t - 0.5);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestId = entry.id;
      }
    }

    // The scroll-spy falls out of the same pass. State is touched only when the
    // winner changes — roughly once per section crossed, not once per frame.
    if (bestId !== activeIdRef.current) {
      activeIdRef.current = bestId;
      setActiveId(bestId);
    }
  }, []);

  const schedule = useCallback(() => {
    // Single source of truth for "a frame is pending". A separate boolean flag
    // alongside this one can desync — notably in a hidden tab, where rAF never
    // fires and a stuck flag would freeze the effect permanently.
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(runPass);
  }, [runPass]);

  const subscribe = useCallback(
    (subscription: Subscription) => {
      // Keyed by id, so StrictMode's double-mount cannot duplicate an entry.
      registry.current.set(subscription.id, subscription);
      schedule();
      return () => {
        registry.current.delete(subscription.id);
      };
    },
    [schedule],
  );

  useEffect(() => {
    measureViewport();
    schedule();

    const onResize = () => {
      measureViewport();
      schedule();
    };

    // requestAnimationFrame is paused entirely while the tab is hidden, so any
    // scroll or resize that happened meanwhile left the cached viewport and the
    // written styles stale. Re-measure on the way back.
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
      measureViewport();
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    // Layout moves when the webfonts swap in; re-measure once they land.
    void document.fonts?.ready.then(onResize);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
  }, [measureViewport, schedule]);

  // Reduced motion hands the sections back to the stylesheet. The scroll-spy
  // keeps running — the TOC must not die just because the animation did.
  useEffect(() => {
    if (!reducedMotion) return;
    for (const subscription of registry.current.values()) {
      const style = subscription.animate.style;
      style.removeProperty("--sine-a");
      style.removeProperty("--sine-o");
      style.removeProperty("--sine-d");
    }
  }, [reducedMotion]);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      // `center`, not `start`: the curve peaks when the section centre meets the
      // viewport centre, so top-aligning would park the target permanently dim —
      // the TOC would appear to fade the very thing you asked to see.
      el.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
      // Without moving focus, a keyboard user's next Tab returns to the TOC
      // rather than entering the content. This is the classic skip-link bug.
      el.focus({ preventScroll: true });
      window.history.replaceState(null, "", `#${id}`);
    },
    [reducedMotion],
  );

  const value = useMemo<SineContextValue>(
    () => ({ subscribe, activeId, scrollToSection, reducedMotion }),
    [subscribe, activeId, scrollToSection, reducedMotion],
  );

  return <SineContext.Provider value={value}>{children}</SineContext.Provider>;
}

function useSineContext(): SineContextValue {
  const context = useContext(SineContext);
  if (!context) {
    throw new Error("useSineContext must be used within a <SineScrollProvider>");
  }
  return context;
}

export type ScrollSectionRefs = {
  readonly measureRef: RefObject<HTMLElement | null>;
  readonly animateRef: RefObject<HTMLDivElement | null>;
};

/** Enrols a section in the shared scroll pass. */
export function useScrollSection(id: string): ScrollSectionRefs {
  const { subscribe } = useSineContext();
  const measureRef = useRef<HTMLElement | null>(null);
  const animateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = measureRef.current;
    const animate = animateRef.current;
    if (!measure || !animate) return;
    return subscribe({ id, measure, animate });
  }, [id, subscribe]);

  return { measureRef, animateRef };
}

export function useActiveSection(): string | null {
  return useSineContext().activeId;
}

export function useScrollToSection(): (id: string) => void {
  return useSineContext().scrollToSection;
}
