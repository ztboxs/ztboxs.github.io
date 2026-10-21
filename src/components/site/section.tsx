import { useInView } from "motion/react"
import { useEffect, useRef } from "react"

import { sections, type SectionId } from "@/content/site"
import { cn } from "@/lib/utils"
import { useSiteStore } from "@/stores/site-store"

type SectionProps = {
  id: SectionId
  title?: string
  kicker?: string
  // Headings over the dusk and night sky need light ink.
  tone?: "day" | "night"
  className?: string
  children: React.ReactNode
}

export function Section({
  id,
  title,
  kicker,
  tone = "day",
  className,
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  // Only the upper part of the viewport counts toward the active section. The
  // 1px inset keeps a section that merely touches the top edge from counting.
  const inView = useInView(ref, { margin: "-1px 0px -60% 0px" })
  const setSectionVisible = useSiteStore((state) => state.setSectionVisible)
  const door = sections.find((section) => section.id === id)!

  useEffect(() => {
    setSectionVisible(id, inView)
  }, [inView, id, setSectionVisible])

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn("relative", title && "py-24 md:py-32", className)}
    >
      {title && (
        <header className="mx-auto mb-10 flex max-w-5xl flex-col items-start gap-3 px-5 md:px-8">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-paper/85 px-3 py-1 text-xs text-muted-foreground shadow-sm ring-1 ring-paper-edge backdrop-blur"
            style={{ "--door": door.color } as React.CSSProperties}
          >
            <span className="size-2.5 rounded-full bg-(--door) ring-2 ring-(--door)/25" />
            {door.door}之门
            {kicker && <span className="font-fell italic">· {kicker}</span>}
          </span>
          <h2
            id={`${id}-title`}
            className={cn(
              "font-heading text-3xl font-bold tracking-wide text-balance md:text-4xl",
              tone === "day"
                ? "[text-shadow:0_1px_0_rgb(255_255_255/0.6),0_0_24px_rgb(255_255_255/0.55)]"
                : "text-[#fff6e3] [text-shadow:0_0_24px_rgb(10_14_40/0.8)]"
            )}
          >
            {title}
          </h2>
        </header>
      )}
      {children}
    </section>
  )
}
