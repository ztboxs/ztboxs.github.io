import {
  BookOpenIcon,
  Building2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  UserRoundIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

import { Reveal } from "@/components/magic/reveal"
import { MediaFrame } from "@/components/site/media-frame"
import { Section } from "@/components/site/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  featuredProjects,
  type DetailBlock,
  type FeaturedProject,
} from "@/content/site"

const tilts = [-3, 2.5, -1.5]

export function FeaturedProjects() {
  return (
    <Section id="projects" title="精选项目" kicker="three rooms">
      <div className="mx-auto flex max-w-5xl flex-col gap-14 px-5 md:px-8">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.id}>
            <ProjectPage project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function ProjectPage({
  project,
  index,
}: {
  project: FeaturedProject
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <article
      aria-labelledby={`${project.id}-name`}
      className="relative overflow-hidden rounded-3xl bg-paper text-card-foreground shadow-[0_24px_60px_-28px_rgb(30_40_70/0.55)] ring-1 ring-paper-edge"
    >
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-25 mix-blend-multiply" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-door-projects/80" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-gold/35 to-transparent"
        animate={open ? { x: ["0%", "400%"] } : { x: "0%" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_15rem] md:gap-10 md:p-10">
        <div className="flex min-w-0 flex-col gap-5">
          <header className="flex flex-col gap-2">
            <span className="font-fell text-sm text-door-projects italic">
              No. {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              id={`${project.id}-name`}
              className="text-3xl font-bold tracking-wide md:text-4xl"
            >
              {project.name}
            </h3>
            <p className="text-lg text-ink/80">{project.subtitle}</p>
          </header>

          <dl className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">时间</dt>
              <CalendarDaysIcon className="size-4" />
              <dd className="font-fell text-base not-italic">
                {project.period}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">角色</dt>
              <UserRoundIcon className="size-4" />
              <dd>{project.role}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-widest text-muted-foreground">
              实际阶段
            </span>
            {project.stage.map((stage) => (
              <Badge
                key={stage}
                variant="outline"
                className="h-6 rounded-full border-door-projects/40 bg-door-projects/8 px-2.5 text-door-projects"
              >
                {stage}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-base leading-8">
            {project.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger
              render={
                <Button
                  variant="outline"
                  className="h-9 rounded-full bg-paper px-4"
                />
              }
            >
              <BookOpenIcon data-icon="inline-start" />
              {open ? "合上案例" : "翻开完整案例"}
              <ChevronDownIcon
                data-icon="inline-end"
                className="transition-transform duration-300 group-aria-expanded/button:rotate-180"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-500 ease-out data-ending-style:h-0 data-starting-style:h-0">
              <div className="flex flex-col gap-7 pt-7">
                {project.details.map((block) => (
                  <DetailSection key={block.title} block={block} />
                ))}
                {project.companyMilestone && (
                  <aside className="rounded-2xl border border-dashed border-paper-edge bg-muted/60 p-4">
                    <h4 className="mb-1 flex items-center gap-1.5 text-sm font-bold tracking-widest text-muted-foreground">
                      <Building2Icon className="size-4" />
                      {project.companyMilestone.title}
                    </h4>
                    <p className="leading-7">{project.companyMilestone.body}</p>
                  </aside>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="grid grid-cols-2 content-start gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-1 md:gap-y-7 md:pt-8">
          {project.media.map((media, i) => (
            <MediaFrame
              key={media.label}
              media={media}
              project={project.name}
              tilt={tilts[i % tilts.length]}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

function DetailSection({ block }: { block: DetailBlock }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest text-door-projects">
        <span className="h-px w-5 bg-door-projects/60" />
        {block.title}
      </h4>
      {block.kind === "list" && (
        <ul className="flex flex-col gap-2 leading-7">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-[0.7rem] size-1.5 shrink-0 rotate-45 bg-gold"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
      {block.kind === "text" &&
        block.body.map((paragraph) => (
          <p key={paragraph} className="leading-8">
            {paragraph}
          </p>
        ))}
      {block.kind === "case" && (
        <div className="rounded-2xl bg-secondary/70 p-4 ring-1 ring-paper-edge md:p-5">
          <p className="mb-2 font-bold">“{block.caseTitle}”</p>
          {block.body.map((paragraph) => (
            <p key={paragraph} className="leading-8">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
