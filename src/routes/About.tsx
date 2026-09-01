import { SOCIAL_LINKS } from "@/data/site";

/** Quick facts rendered in the sidebar column. */
const FACTS: readonly { label: string; value: string }[] = [
  { label: "LOCATION", value: "Tampa Bay, Florida" },
  { label: "ROLE", value: "Full Stack Developer" },
  { label: "SERVICE", value: "US Army Veteran" },
  { label: "LANGUAGES", value: "English / Polish" },
];

export function About() {
  return (
    <div className="mx-auto w-full max-w-[100rem] px-6 md:px-10">
      <header className="border-b border-border py-20 md:py-28">
        <p className="m-0 mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          ABOUT
        </p>
        <h1 className="m-0 font-serif text-5xl font-bold leading-[1.05] md:text-8xl">
          About Me
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-x-16 gap-y-12 py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 max-w-[62ch]">
          <p className="m-0 text-lg leading-relaxed text-muted-foreground md:text-xl">
            I'm Daniel Poprawski, a full-stack developer based in Florida. I got my start
            in software as a developer intern at Code Tega, building customer relationship
            management software for dance studios across the US with TypeScript, React,
            SQL, and Firebase.
          </p>
          <p className="mt-6 mb-0 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Before writing code professionally, I served in the US Army as a Joint Fire
            Support Specialist, where I held a Secret Security Clearance and served as my
            squadron's Polish interpreter. The Army taught me to stay disciplined, work
            under pressure, and communicate clearly — habits I bring to every project.
          </p>
          <p className="mt-6 mb-0 text-lg leading-relaxed text-muted-foreground md:text-xl">
            These days I'm studying while building things on the side — most recently
            Albas, an all-in-one productivity suite. I enjoy working across the stack,
            from React frontends to Rust and Linux tooling, and I'm always picking up
            something new.
          </p>
        </div>

        <aside>
          <dl className="m-0 border-t border-border">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-b border-border py-4">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="m-0 mt-1 font-mono text-sm tracking-[0.04em] text-foreground">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="m-0 mt-8 flex list-none flex-wrap items-center gap-6 p-0">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
