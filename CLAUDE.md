# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Source of 艾伦's personal website, served at https://ztboxs.github.io. It is a single-page Vite + React 19 + TypeScript app in Simplified Chinese, aimed at startup founders, potential partners and hiring managers. The old Hexo blog output that used to live here was removed on 2026-10-21 and only survives in git history.

## Commands

- `npm run dev` starts the dev server.
- `npm run build` typechecks (`tsc -b`) and builds into `dist/`.
- `npm run lint` runs ESLint. `npm run format` runs Prettier (with the Tailwind class sorter).
- `npx shadcn@latest add <component>` adds a shadcn/ui component into `src/components/ui/`.

There are no tests yet.

## Deployment

`.github/workflows/deploy.yml` lints, builds and publishes `dist/` to GitHub Pages on every push to `master`. The repo's Pages source must be set to "GitHub Actions" (Settings, Pages). Do not commit `dist/`. Never publish or push on the owner's behalf without being asked.

## Design concept: 艾伦的移动城堡

The whole site is a moving castle travelling through one day, in a hand-painted storybook style inspired by (not copied from) Ghibli's Howl's Moving Castle. Keep every character, building and symbol original; do not reproduce the film's characters, the castle's design or the fire demon.

- **Sky**: `SkyBackdrop` drives a fixed background from morning to night with scroll progress (`useScroll` + `useTransform`). Clouds, sun and stars are tinted by the same progress.
- **Navigation**: `DoorDial` is the castle door's colour dial. Each section has a door colour in `sections` (`src/content/site.ts`) and a matching `--door-*` token in `src/index.css`. Clicking a door plays `DoorPortal` (light pours out of the clicked point, the page jumps, the light fades). Use `useDoorLink()` for any link to a section so it gets the same transition. Below `xl` the dial tucks away while scrolling down.
- **Pages**: content sits on paper cards (`bg-paper`, `ring-paper-edge`, `paper-grain`). The contact section is a `.dark` scope under the night sky. Section headings over dusk/night use `tone="night"`.
- **Motion**: content appears with `Reveal`/`revealMotion` (blur to sharp). The hero castle walks; the pointer leaves stardust (`StardustTrail`, fine pointers only); hovering a working method feeds the hearth fire; the timeline path draws itself. `MotionConfig reducedMotion="user"` is set and the portal and trail switch off under reduced motion.
- **Type**: LXGW WenKai Screen (simplified subset CSS, loaded per glyph range) for all Chinese; IM Fell English (`font-fell`) for dates and small Latin flourishes.

## Dependency rules

Prefer mature libraries, keep component source under our control, keep one design language, and never add a second library for a job an existing dependency already covers. Do not hand-write a component or behavior that an installed dependency can express correctly.

| Concern | Use | Notes |
| --- | --- | --- |
| UI components | shadcn/ui, `base-nova` style on Base UI (`components.json`) | Add via the shadcn CLI; the source lands in `src/components/ui/` and is ours to edit. Do not add Radix, MUI, etc. |
| Styling | Tailwind CSS v4 with the theme tokens in `src/index.css` | Merge classes with `cn` from `@/lib/utils`. |
| Icons | `lucide-react` only | Lucide v1 has no brand icons, so GitHub uses `FolderGit2Icon`. |
| Animation | `motion` (`motion/react`) | For CSS enter/exit on shadcn primitives, `tw-animate-css` is already in place. |
| State | `zustand` (`src/stores/site-store.ts`) | Active section, door transition state. Use the `persist` middleware for anything that should survive a reload. |
| Layout panels | `react-resizable-panels` via `npx shadcn add resizable` | Not installed now; this is the one to use if panels are needed. |
| Drag and drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Not installed now; this is the one to use if dragging is needed. |

## Layout of the source

- `src/content/site.ts` holds every word on the site plus media slots. Change content here, not in components.
- `src/components/sections/` has one component per section, in page order: hero, featured-projects, explorations, about, timeline, contact.
- `src/components/magic/` holds the illustrations and effects (sky, clouds, castle, meadow, hearth, dial, portal, stardust, falling stars, reveal).
- `src/components/site/` holds the `Section` shell (scroll spy + heading) and `MediaFrame` (pinned photo / placeholder).
- `src/components/ui/` is shadcn-generated.

## Content rules (confirmed by the owner, do not loosen)

- Simplified Chinese, concrete and restrained. No unbacked claims ("行业领先", "商业闭环已验证" and the like).
- Never invent education, school, age, awards, clients, user counts, revenue, growth, funding amounts or team size. Never fill in months for year-only entries, and never extend open-ended dates ("起").
- Keep these states separate: code exists, tests pass, internal demo, partial external trial, public launch, commercial results.
- Keep personal contribution separate from team results. NomaCook's AI work was co-developed with a teammate. The companion company's seed round is a company milestone, not 艾伦's achievement, and must stay in its own block.
- The AI companion company stays anonymous everywhere (text, images, video, captions, file names, alt text, metadata). No real company or product name, logo, domain or client.
- No phone number, private repo links, internal URLs, credentials, logs or user data. No résumé download unless a confirmed file exists. No contact form without a real backend. No QR code for WeChat.
- Media without a real asset stays a visible `待补` placeholder naming the project, asset type and any anonymisation need. Never generate fake screenshots, testimonials, logos or numbers. Neon AI is text only. When a real asset is added, set `src` and drop the `待补` wording from its label.
- Do not write private background (looking for stable income, disputes at the previous company) into the site.
- Date ranges are written `2025.10 至 2026.07` (no dash characters in copy).
