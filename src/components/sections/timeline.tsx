import { motion, useScroll, useSpring } from "motion/react"
import { useRef } from "react"

import { revealMotion } from "@/components/magic/reveal"
import { Section } from "@/components/site/section"
import { ornaments } from "@/content/art"
import { timeline } from "@/content/site"

// The castle's journey: a golden path draws itself as the visitor scrolls.
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.55"],
  })
  const pathLength = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <Section
      id="timeline"
      title="经历时间线"
      kicker="the road so far"
      ornament={ornaments.hat}
      className="dark text-foreground"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8">
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 40 1000"
            preserveAspectRatio="none"
            className="absolute top-2 bottom-2 left-0 h-[calc(100%-1rem)] w-10"
          >
            <path
              d="M20 0 C34 120 6 210 20 330 C34 450 6 540 20 660 C34 780 6 870 20 1000"
              fill="none"
              stroke="rgb(255 255 255 / 0.35)"
              strokeWidth="3"
              strokeDasharray="2 8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M20 0 C34 120 6 210 20 330 C34 450 6 540 20 660 C34 780 6 870 20 1000"
              fill="none"
              stroke="#ffd56b"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength, filter: "drop-shadow(0 0 4px #ffcf5a)" }}
            />
          </svg>

          <ol ref={ref} className="flex flex-col gap-6">
            {timeline.map((entry, i) => (
              <motion.li
                key={`${entry.period}-${entry.title}`}
                {...revealMotion(i * 0.05)}
                className="relative pl-14"
              >
                <motion.span
                  aria-hidden
                  className="absolute top-6 left-[13px] size-3.5 rotate-45 rounded-[3px] bg-[#ffd56b] ring-4 ring-[#ffd56b]/25"
                  initial={{ scale: 0.4, opacity: 0.4 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ margin: "0px 0px -40% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                />
                <div className="rounded-2xl bg-paper p-5 shadow-[0_16px_36px_-22px_rgb(5_8_25/0.8)] ring-1 ring-paper-edge backdrop-blur md:p-6">
                  <p className="font-fell text-lg text-gold">{entry.period}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-wide">
                    {entry.title}
                  </h3>
                  <p className="mt-1 leading-7 text-muted-foreground">
                    {entry.note}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
