import type { MouseEvent } from "react";
import { useActiveSection, useScrollToSection } from "@/hooks/use-sine-scroll";
import { cn } from "@/lib/utils";

export type TocItem = {
  readonly id: string;
  readonly label: string;
};

export type TableOfContentsProps = {
  readonly items: readonly TocItem[];
  readonly className?: string;
};

/**
 * Real anchors, deliberately. A <nav> + <ol> + <a href="#id"> + aria-current is
 * the pattern assistive-tech users already know: every entry is its own tab
 * stop, Enter follows it, and it still works with JS disabled. A listbox-style
 * widget would impose a roving tabindex and selection semantics that are simply
 * wrong for a document outline.
 *
 * No aria-live — announcing on every section crossing would be intolerable.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const activeId = useActiveSection();
  const scrollToSection = useScrollToSection();

  const handleClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, etc.) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <nav aria-label="Resume sections" className={className}>
      <p className="m-0 mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Contents
      </p>

      <ol className="m-0 list-none space-y-3 p-0">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.16em] no-underline transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Brackets always occupy space, so the active marker never reflows. */}
                <span aria-hidden="true" className={isActive ? "" : "opacity-0"}>
                  [
                </span>
                {item.label}
                <span aria-hidden="true" className={isActive ? "" : "opacity-0"}>
                  ]
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
