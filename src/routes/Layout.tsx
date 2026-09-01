import { Outlet } from "react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export function Layout() {
  return (
    <>
      <a href="#main" className="u-skip-link">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
