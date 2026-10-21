import { motion, useInView, useScroll, useTransform } from "motion/react"
import { useEffect, useRef } from "react"

import type { Scene } from "@/content/art"
import { doors, sections, type SectionId } from "@/content/site"
import { cn } from "@/lib/utils"
import { useSiteStore } from "@/stores/site-store"

type SectionProps = {
  id: SectionId
  title?: string
  kicker?: string
  // The view through the door: a film still shown as a wide banner.
  scene?: Scene
  className?: string
  children: React.ReactNode
}

export function Section({
  id,
  title,
  kicker,
  scene,
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
        <SceneBanner
          id={id}
          title={title}
          kicker={kicker}
          scene={scene}
          doorName={door?.name}
        />
      )}
      {children}
    </section>
  )
}

function SceneBanner({
  id,
  title,
  kicker,
  scene,
  doorName,
}: {
  id: string
  title: string
  kicker?: string
  scene?: Scene
  doorName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // A slow push-in with parallax, as if the door were swinging open.
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1.02])
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <div className="mx-auto mb-[-5rem] max-w-6xl px-3 md:mb-[-7rem] md:px-6">
      <motion.div
        ref={ref}
        className="relative h-[46svh] min-h-72 overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgb(20_25_50/0.6)] ring-1 ring-white/30 md:h-[62svh] md:rounded-[2.5rem]"
        initial={{
          clipPath: "inset(18% 22% 18% 22% round 2.5rem)",
          opacity: 0.4,
        }}
        whileInView={{
          clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
          opacity: 1,
        }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
      >
        {scene && (
          <motion.img
            src={scene.src}
            alt={scene.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
            style={{ scale, y, objectPosition: scene.position }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[rgb(14_18_38/0.82)] via-[rgb(14_18_38/0.15)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 pb-28 md:p-12 md:pb-36">
          {doorName && (
            <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs text-white/90 ring-1 ring-white/25 backdrop-blur-md">
              <span className="size-2.5 rounded-full bg-(--door) ring-2 ring-white/40" />
              {doorName}之门
              {kicker && (
                <span className="font-fell italic opacity-80">· {kicker}</span>
              )}
            </span>
          )}
          <h2
            id={`${id}-title`}
            className="text-3xl font-bold tracking-wide text-balance text-[#fffaf0] [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] md:text-5xl"
          >
            {title}
          </h2>
        </div>
      </motion.div>
    </div>
  )
}
