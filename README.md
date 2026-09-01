# danni-dev.com

Personal portfolio for Daniel Poprawski — a "Premium Monochrome Editorial" site
pairing the structural honesty of the early web with modern engineering.

## Stack

- **Runtime / bundler:** Bun (`Bun.serve()` with HTML imports — no vite, no express)
- **UI:** React 19, react-router 8 (`createBrowserRouter`, data-router mode)
- **Styling:** Tailwind CSS v4 (CSS-first config, no `tailwind.config.*`) + shadcn/ui tokens
- **Type:** Noto Serif Display (editorial) + Victor Mono (structural labels, navigation)

## Commands

```sh
bun install
bun dev         # http://localhost:3000 (PORT=xxxx to override)
bun test        # unit tests
bun run typecheck
bun run build   # production bundle -> dist/
```

## Layout

```
src/
  frontend.tsx              router entry
  routes/                   Layout, Index, Resume, NotFound
  components/               site chrome, hero, featured card
    resume/                 section wrapper, timeline entry, table of contents
  hooks/
    use-sine-scroll.tsx     shared scroll pass + scroll-spy
    use-reduced-motion.ts   prefers-reduced-motion, via useSyncExternalStore
    use-reveal.ts           one-shot IntersectionObserver reveal
  lib/sine.ts               pure scroll math (unit tested)
  data/                     resume + site content
styles/globals.css          design tokens
```

## The resume scroll effect

Each section's centre is measured against the viewport centre and normalised to
`t ∈ [0,1]`; `sin(πt)` peaks at 1.0 when the section is dead centre. That value
drives opacity and scale — and nothing else.

Three things are worth knowing before changing it:

**The reachability clamp.** A naive sine leaves the first section permanently
dim (nothing above it to scroll, so it can never reach centre) and the last
section likewise. Rather than padding 50vh of dead space at both ends, the
effective distance is capped by the distance the user could actually scroll:
if you cannot scroll far enough to centre an element, it is not penalised for
the distance you cannot remove. See `sineProgress` in `src/lib/sine.ts`; the
edge cases are locked down in `src/lib/sine.test.ts`.

**Two elements per section.** The outer `<section>` is measured and stays
untransformed in normal flow; the inner child is transformed. Sharing one node
would feed the parallax translate back into the next frame's measurement.
Because the measured box never moves, the effect cannot cause layout shift.

**JS writes only custom properties.** `--sine-a`, `--sine-o`, `--sine-d` are set
from one rAF-throttled scroll pass; all opacity and transform composition lives
in CSS. That keeps the cascade in charge, so the `prefers-reduced-motion`,
`prefers-contrast`, and `:focus-within` overrides win on ordinary source order
with no `!important` — and the `var()` fallbacks mean first paint is the settled,
fully-visible state before any JS runs.

## Accessibility

WCAG compliance is met with semantic HTML rather than a widget library: real
`<nav>`/`<ol>`/`<a>`, `aria-current`, a skip link, focus rings on the `--ring`
token, and full `prefers-reduced-motion` support. Faded sections are pinned
opaque by `:focus-within`, and the table of contents moves focus into the
section it scrolls to.
