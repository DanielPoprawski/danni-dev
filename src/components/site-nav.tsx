import { NavLink } from "react-router";
import { NAV_ITEMS, SITE, SOCIAL_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Two static links. A semantic <nav><ul> with NavLink beats Radix
 * NavigationMenu here: real anchors, free aria-current, no dropdown runtime.
 */
export function SiteNav() {
  const email = SOCIAL_LINKS.find((link) => link.href.startsWith("mailto:"));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-6 px-6 md:px-10">
        <NavLink
          to="/"
          className="font-mono text-xs tracking-[0.2em] text-foreground no-underline shrink-0"
        >
          {SITE.wordmark}
        </NavLink>

        <nav aria-label="Primary">
          <ul className="flex list-none items-center gap-2 sm:gap-6 m-0 p-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "font-mono text-xs uppercase tracking-[0.18em] no-underline px-2 py-1 transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Brackets always occupy space, so activating a link
                          never reflows the nav. */}
                      <span aria-hidden="true" className={isActive ? "" : "opacity-0"}>
                        [
                      </span>
                      {item.label}
                      <span aria-hidden="true" className={isActive ? "" : "opacity-0"}>
                        ]
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {email ? (
          <a
            href={email.href}
            className="hidden sm:inline-block shrink-0 border border-foreground bg-foreground px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-background no-underline transition-colors hover:bg-background hover:text-foreground"
          >
            CONNECT
          </a>
        ) : null}
      </div>
    </header>
  );
}
