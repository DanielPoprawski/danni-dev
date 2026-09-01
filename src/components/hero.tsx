import { SITE } from "@/data/site";
import logo from "@/logo.svg";

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 py-24 text-center md:py-36">
      <img
        src={logo}
        alt=""
        width={96}
        height={96}
        // Explicit dimensions + grayscale keep the multicolour source mark
        // on-palette without a second asset. Decorative: the wordmark below
        // carries the accessible name.
        className="mb-10 h-24 w-24 [filter:grayscale(1)]"
      />

      <h1 className="m-0 font-mono text-[clamp(1.75rem,7vw,4.5rem)] font-normal leading-none tracking-[0.08em] text-foreground">
        {SITE.name}
      </h1>

      <p className="mt-6 mb-0 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">
        {SITE.tagline}
      </p>

      <p className="mx-auto mt-16 mb-0 max-w-[52ch] text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
        {SITE.positioning}
      </p>
    </section>
  );
}
