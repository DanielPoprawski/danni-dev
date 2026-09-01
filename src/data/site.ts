/** Site-wide chrome: navigation and outbound links. */

export type NavItem = {
  readonly to: string;
  readonly label: string;
  /** react-router NavLink `end` — the index route must not stay active on /resume. */
  readonly end?: boolean;
};

export type SocialLink = {
  readonly href: string;
  readonly label: string;
};

export const SITE = {
  name: "danni-dev.com",
  author: "Daniel Poprawski",
  tagline: "[ WELCOME TO MY PORTFOLIO! ]",
  wordmark: "DEV_ARCHIVE_v1.0",
  footerNote: "BUILT FOR ARCHIVAL PERMANENCE",
  positioning:
    "Bridging the structural honesty of the early web with the expansive elegance of modern software engineering. I build robust digital architectures that prioritize clarity, permanence, and uncompromising performance.",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "INDEX", end: true },
  { to: "/resume", label: "RESUME" },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: "https://github.com/DanielPoprawski", label: "GITHUB" },
  { href: "https://linkedin.com/in/daniel-poprawski", label: "LINKEDIN" },
  { href: "mailto:me@danni-dev.com", label: "EMAIL" },
];

export const FEATURED = {
  href: "https://albas.danni-dev.com",
  name: "Albas",
  description: "The all in one suite for managing productivity.",
  meta: "PROJECT — LIVE",
} as const;
