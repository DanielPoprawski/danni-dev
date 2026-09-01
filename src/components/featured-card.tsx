import { FEATURED } from "@/data/site";

export function FeaturedCard() {
  return (
    <section className="mx-auto w-full max-w-[100rem] px-6 pb-24 md:px-10">
      <h2 className="sr-only">Featured project</h2>
      <a
        href={FEATURED.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-border bg-muted p-8 no-underline transition-colors hover:bg-background md:p-12"
      >
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {FEATURED.meta}
        </span>

        <span className="mt-6 flex items-baseline gap-3">
          <span className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            {FEATURED.name}
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-xl text-muted-foreground transition-transform group-hover:translate-x-1"
          >
            ↗
          </span>
        </span>

        <span className="mt-4 block max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
          {FEATURED.description}
        </span>

        <span className="mt-8 block border-t border-border pt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          albas.danni-dev.com
          <span className="sr-only"> (opens in a new tab)</span>
        </span>
      </a>
    </section>
  );
}
