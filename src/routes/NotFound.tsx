import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[100rem] flex-col items-center justify-center px-6 text-center">
      <p className="m-0 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        ERROR 404
      </p>
      <h1 className="mt-6 mb-0 font-serif text-5xl font-bold md:text-7xl">Not in the archive</h1>
      <p className="mt-6 mb-0 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
        This record does not exist. It may have been moved, or it may never have been written.
      </p>
      <Link
        to="/"
        className="mt-10 border border-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground no-underline transition-colors hover:bg-foreground hover:text-background"
      >
        Return to index
      </Link>
    </section>
  );
}
