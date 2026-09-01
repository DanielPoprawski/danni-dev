import type { ReactNode } from "react";
import { useScrollSection } from "@/hooks/use-sine-scroll";
import { cn } from "@/lib/utils";

export type ResumeSectionProps = {
  readonly id: string;
  readonly title: string;
  readonly kicker?: string;
  readonly className?: string;
  readonly children: ReactNode;
};

/**
 * Measurement wrapper + transformed child.
 *
 * The <section> keeps its untransformed box in normal flow forever, so nothing
 * the effect does can move a sibling — that is the structural reason this
 * cannot produce layout shift. tabIndex={-1} makes it a programmatic focus
 * target for the table of contents.
 */
export function ResumeSection({ id, title, kicker, className, children }: ResumeSectionProps) {
  const { measureRef, animateRef } = useScrollSection(id);

  return (
    <section
      id={id}
      ref={measureRef}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="sine-section py-20 outline-none md:py-28"
    >
      <div ref={animateRef} className={cn("sine-content", className)}>
        {kicker ? (
          <p className="m-0 mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {kicker}
          </p>
        ) : null}

        <h2
          id={`${id}-heading`}
          className="m-0 font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl"
        >
          {title}
        </h2>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
