import { SITE, SOCIAL_LINKS } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-[100rem] flex-col items-center justify-between gap-4 px-6 py-8 text-center md:flex-row md:px-10 md:text-left">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          © {year} {SITE.name} — {SITE.footerNote}
        </p>
        <ul className="flex list-none items-center gap-6 m-0 p-0">
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
      </div>
    </footer>
  );
}
