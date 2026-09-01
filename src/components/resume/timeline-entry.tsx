import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";

export type TimelineEntryProps = {
  readonly period: string;
  readonly org: string;
  readonly role?: string;
  readonly bullets?: readonly string[];
  /** Drives the stagger on the one-shot reveal. */
  readonly index: number;
};

export function TimelineEntry({ period, org, role, bullets, index }: TimelineEntryProps) {
  const ref = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className="reveal relative grid grid-cols-1 gap-2 border-l border-border pb-14 pl-8 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8 md:pl-12"
      style={{ "--stagger": index } as CSSProperties}
    >
      {/* Timeline node. Decorative — the period text carries the meaning. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 -translate-x-1/2 bg-foreground"
      />

      <div className="font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-muted-foreground md:pt-1">
        {period}
      </div>

      <div className="min-w-0">
        <h3 className="m-0 font-serif text-2xl font-bold leading-snug text-foreground md:text-3xl">
          {org}
        </h3>

        {role ? (
          <p className="m-0 mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {role}
          </p>
        ) : null}

        {bullets && bullets.length > 0 ? (
          <ul className="mt-5 mb-0 list-none space-y-2 p-0">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="relative pl-5 leading-relaxed text-muted-foreground before:absolute before:left-0 before:content-['—']"
              >
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
