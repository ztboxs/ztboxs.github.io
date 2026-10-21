import { motion, useInView } from "motion/react"
import { useEffect, useRef } from "react"

import { Ornament } from "@/components/magic/ornament"
import type { Art } from "@/content/art"
import { doors, sections, type SectionId } from "@/content/site"
import { cn } from "@/lib/utils"
import { useSiteStore } from "@/stores/site-store"

type SectionProps = {
  id: SectionId
  title?: string
  kicker?: string
  // A small painted keepsake that sits beside the heading.
  ornament?: Art
  className?: string
  children: React.ReactNode
}

export function Section({
  id,
  title,
  kicker,
  ornament,
  className,
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  // Only the upper part of the viewport counts toward the active section. The
  // 1px inset keeps a section that merely touches the top edge from counting.
  const inView = useInView(ref, { margin: "-1px 0px -60% 0px" })
  const setSectionVisible = useSiteStore((state) => state.setSectionVisible)
  const doorId = sections.find((section) => section.id === id)?.door
  const door = doors.find((candidate) => candidate.id === doorId)

  useEffect(() => {
    setSectionVisible(id, inView)
  }, [inView, id, setSectionVisible])

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn(
        "relative",
        title && "pt-20 pb-24 md:pt-28 md:pb-32",
        className
      )}
      style={
        door ? ({ "--door": door.color } as React.CSSProperties) : undefined
      }
    >
      {title && (
        <SectionHeading
          id={id}
          title={title}
          kicker={kicker}
          ornament={ornament}
          doorName={door?.name}
          // The night door is nearly black, so its sections underline in gold.
          night={door?.id === "night"}
        />
      )}
      {children}
    </section>
  )
}

function SectionHeading({
  id,
  title,
  kicker,
  ornament,
  doorName,
  night,
}: {
  id: string
  title: string
  kicker?: string
  ornament?: Art
  doorName?: string
  night: boolean
}) {
  return (
    <div className="relative z-10 mx-auto mb-10 flex max-w-5xl items-end justify-between gap-4 px-5 md:mb-14 md:px-8">
      <motion.div
        className="flex min-w-0 flex-col gap-3"
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {doorName && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-paper/70 px-3 py-1 text-xs text-foreground/85 ring-1 ring-paper-edge backdrop-blur-md">
            <span className="size-2.5 rounded-full bg-(--door) ring-2 ring-white/50" />
            {doorName}之门
            {kicker && (
              <span className="font-fell italic opacity-75">· {kicker}</span>
            )}
          </span>
        )}
        <h2
          id={`${id}-title`}
          className="text-4xl font-bold tracking-wide text-balance [text-shadow:0_0_28px_var(--background)] md:text-6xl"
        >
          {title}
        </h2>
        {/* A brush stroke drawn under the title once it comes into view. */}
        <svg
          aria-hidden
          viewBox="0 0 220 14"
          className="h-3 w-36 overflow-visible md:w-52"
        >
          <motion.path
            d="M3 9 C 40 2, 72 13, 110 7 S 182 3, 217 8"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            className={night ? "stroke-gold" : "stroke-(--door)"}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.35, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      {ornament && (
        <Ornament
          art={ornament}
          delay={0.2}
          className="-mb-3 w-24 shrink-0 sm:w-32 md:w-44"
        />
      )}
    </div>
  )
}
