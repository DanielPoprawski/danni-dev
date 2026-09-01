import { SineScrollProvider } from "@/hooks/use-sine-scroll";
import { ResumeSection } from "@/components/resume/resume-section";
import { TimelineEntry } from "@/components/resume/timeline-entry";
import { TableOfContents, type TocItem } from "@/components/resume/table-of-contents";
import { EDUCATION, EXPERIENCE, SKILL_GROUPS, SUMMARY } from "@/data/resume";

/** Single source of truth for both the outline and the rendered section order. */
const TOC_ITEMS: readonly TocItem[] = [
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  ...SKILL_GROUPS.map((group) => ({ id: group.id, label: group.label })),
];

export function Resume() {
  return (
    <SineScrollProvider>
      <div className="mx-auto w-full max-w-[100rem] px-6 md:px-10">
        {/*
          No `place-items` on this grid: it would collapse the aside to content
          height, leaving position:sticky no travel room at all.
        */}
        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_14rem]">
          {/* min-w-0 — without it a long unbroken string blows out the 1fr track. */}
          <div className="min-w-0">
            {/*
              The lede is deliberately NOT an animated section. Nothing is faded
              on first paint, which keeps the largest contentful element at full
              opacity from the very first frame.
            */}
            <header className="border-b border-border py-20 md:py-28">
              <p className="m-0 mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                DEV_ARCHIVE_v1.0 / RESUME
              </p>
              <h1 className="m-0 font-serif text-5xl font-bold leading-[1.05] md:text-8xl">
                Curriculum Vitae
              </h1>
              <p className="mt-10 mb-0 max-w-[60ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                {SUMMARY}
              </p>
            </header>

            <ResumeSection id="experience" title="Experience" kicker="01 — PROFESSIONAL RECORD">
              <ol className="m-0 list-none p-0">
                {EXPERIENCE.map((entry, index) => (
                  <TimelineEntry
                    key={entry.id}
                    index={index}
                    period={entry.period}
                    org={entry.org}
                    role={entry.role}
                    bullets={entry.bullets}
                  />
                ))}
              </ol>
            </ResumeSection>

            <ResumeSection id="education" title="Education" kicker="02 — ACADEMIC RECORD">
              <ol className="m-0 list-none p-0">
                {EDUCATION.map((entry, index) => (
                  <TimelineEntry
                    key={entry.id}
                    index={index}
                    period={entry.period}
                    org={entry.institution}
                    role={entry.credential}
                  />
                ))}
              </ol>
            </ResumeSection>

            {SKILL_GROUPS.map((group, groupIndex) => (
              <ResumeSection
                key={group.id}
                id={group.id}
                title={group.label}
                kicker={`0${groupIndex + 3} — INDEX`}
              >
                <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-b border-border pb-3 font-mono text-sm tracking-[0.04em] text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            ))}
          </div>

          <aside className="hidden lg:block">
            <TableOfContents
              items={TOC_ITEMS}
              className="sticky top-[calc(var(--nav-h)+3rem)] max-h-[calc(100dvh-var(--nav-h)-6rem)] overflow-y-auto"
            />
          </aside>
        </div>
      </div>
    </SineScrollProvider>
  );
}
