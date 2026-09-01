import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * One-shot reveal for timeline entries.
 *
 * This is the one place IntersectionObserver is the right tool: the reveal is
 * discrete state (has it been seen?), fired once, then unobserved. The
 * continuous sine curve deliberately does NOT use IO — thresholds quantise a
 * continuous signal and produce visible stepping.
 *
 * Latching matters: an entry that re-fades while you are reading it is
 * infuriating, so the observer never un-reveals.
 */

let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "true");
        sharedObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
  );
  return sharedObserver;
}

export function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = getObserver();
    if (!observer) {
      // No IO support — show everything rather than hiding it forever.
      el.setAttribute("data-revealed", "true");
      return;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return ref;
}
