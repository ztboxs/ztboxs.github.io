import { CalendarDaysIcon, UserRoundIcon } from "lucide-react"

import { Reveal } from "@/components/magic/reveal"
import { MediaFrame } from "@/components/site/media-frame"
import { Section } from "@/components/site/section"
import { Badge } from "@/components/ui/badge"
import { ornaments } from "@/content/art"
import { explorations } from "@/content/site"

export function Explorations() {
  return (
    <Section
      id="explorations"
      title="其他经历与探索"
      kicker="the open fields"
      ornament={ornaments.wildflowers}
    >
      <div className="relative z-10 mx-auto grid max-w-5xl items-start gap-8 px-5 md:grid-cols-2 md:px-8">
        {explorations.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.12}>
            <article
              aria-labelledby={`${item.id}-name`}
              className="relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl bg-paper p-6 shadow-[0_20px_50px_-26px_rgb(30_50_40/0.5)] ring-1 ring-paper-edge md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 paper-grain opacity-25 mix-blend-multiply" />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-door-meadow/80" />
              <header className="relative flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    id={`${item.id}-name`}
                    className="text-2xl font-bold tracking-wide"
                  >
                    {item.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full border-door-meadow/45 bg-door-meadow/10 px-2.5 text-[oklch(0.42_0.09_140)]"
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-ink/80">{item.subtitle}</p>
              </header>
              <dl className="relative flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">时间</dt>
                  <CalendarDaysIcon className="size-4" />
                  <dd className="font-fell text-base">{item.period}</dd>
                </div>
                {item.role && (
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">角色</dt>
                    <UserRoundIcon className="size-4" />
                    <dd>{item.role}</dd>
                  </div>
                )}
              </dl>
              <div className="relative flex flex-col gap-3 leading-8">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {item.highlights && (
                <ul
                  className="relative flex flex-wrap gap-2"
                  aria-label="重点功能"
                >
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full bg-secondary px-3 py-1 text-sm ring-1 ring-paper-edge"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              {item.media && (
                <div className="relative mt-auto grid grid-cols-3 gap-3 pt-3">
                  {item.media.map((media, i) => (
                    <MediaFrame
                      key={media.label}
                      media={media}
                      project={item.name}
                      tilt={[-2.5, 1.5, -1][i]}
                    />
                  ))}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
