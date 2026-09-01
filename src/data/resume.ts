/**
 * Single source of truth for resume content.
 * Ordering here is the ordering on the page — reordering is a data edit.
 */

export type ExperienceEntry = {
  readonly id: string;
  readonly period: string;
  readonly org: string;
  readonly role: string;
  readonly bullets: readonly string[];
};

export type EducationEntry = {
  readonly id: string;
  readonly period: string;
  readonly institution: string;
  readonly credential?: string;
};

export type SkillGroup = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly string[];
};

export const SUMMARY =
  "Full-stack developer with experience building web applications and a solid foundation in modern development practices. Quick to learn new technologies and frameworks, with a focus on clean code and user-friendly solutions. As an army veteran, I bring discipline and strong problem-solving skills to development teams, ready to contribute across any area of software development.";

/** Reverse-chronological. */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: "publix",
    period: "JUL 2025 — APR 2026",
    org: "Publix Deli",
    role: "Deli Clerk",
    bullets: [
      "Sliced deli meats and cheeses",
      "Made custom sandwiches and salads for clients",
      "Restocked iced tea, unloaded deliveries of deli items",
      "Fried chicken and prepared other food items for the deli",
    ],
  },
  {
    id: "code-tega",
    period: "DEC 2024 — JUN 2025",
    org: "Compete Studios | Code Tega",
    role: "Software Developer Intern",
    bullets: [
      "Junior Developer at Code Tega, working for Compete Studios to create comprehensive Customer Relation Management software for dance studios across the US",
      "Working with Typescript, React, SQL, and Firebase",
    ],
  },
  {
    id: "us-army",
    period: "AUG 2021 — FEB 2025",
    org: "US Army",
    role: "Joint Fire Support Specialist",
    bullets: [
      "Joint Fire Support Specialist holding a Secret Security Clearance in the US Army",
      "Served as the designated Squadron Interpreter for Polish, assisting Headquarters, Medics, Chaplain, Master Gunner, and numerous other soldiers",
      "Provided instructions to, and mentored junior enlisted soldiers",
      "Performed well under pressure",
    ],
  },
  {
    id: "t-mobile",
    period: "JUL 2020 — AUG 2021",
    org: "T-Mobile & Sprint",
    role: "Sales Representative",
    bullets: [
      "Sales Representative for three different T-Mobile locations in Sarasota and Bradenton, Florida",
      "Top sales representative in district for two consecutive months",
      "Handled cash and inventory",
      "Customer service relations",
    ],
  },
];

export const EDUCATION: readonly EducationEntry[] = [
  {
    id: "hcc",
    period: "2026 — PRESENT",
    institution: "Hillsborough Community College",
  },
  {
    id: "scf",
    period: "2025 — 2026",
    institution: "State College of Florida",
  },
  {
    id: "norwid",
    period: "2018 — 2020",
    institution: "Cyprian Kamil Norwid High School",
  },
  {
    id: "riverview",
    period: "2016 — 2018",
    institution: "Riverview High School",
  },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: "hard-skills",
    label: "Hard Skills",
    items: ["Javascript", "Java", "Rust", "SQL", "React", "Git", "Docker", "AWS", "Linux (RHEL)"],
  },
  {
    id: "soft-skills",
    label: "Soft Skills",
    items: [
      "Customer Service",
      "Sales",
      "Cash Handling",
      "Inventory Management",
      "Leadership",
      "Planning",
      "Security",
      "Performance Evaluations",
      "Effective Communication",
      "Problem Solving",
    ],
  },
  {
    id: "languages",
    label: "Languages",
    items: ["English (Native)", "Polish (Fluent)"],
  },
  {
    id: "qualifications",
    label: "Qualifications",
    items: [
      "Secret Security Clearance",
      "Microsoft Word Specialist 2016",
      "Microsoft Excel Specialist 2016",
      "First Aid (TCCC)",
    ],
  },
];
