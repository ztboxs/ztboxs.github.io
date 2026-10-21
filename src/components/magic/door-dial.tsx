import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import { useEffect, useState } from "react"

import { useDoorLink } from "@/components/magic/use-door-link"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { sections } from "@/content/site"
import { useActiveSection, useSiteStore } from "@/stores/site-store"

const SEGMENT = 360 / sections.length
const OUTER = 50
const INNER = 22

function wedge(index: number) {
  const toPoint = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return `${(Math.cos(rad) * radius).toFixed(2)} ${(Math.sin(rad) * radius).toFixed(2)}`
  }
  const start = index * SEGMENT + 1.5
  const end = (index + 1) * SEGMENT - 1.5
  return [
    `M${toPoint(start, INNER)}`,
    `L${toPoint(start, OUTER)}`,
    `A${OUTER} ${OUTER} 0 0 1 ${toPoint(end, OUTER)}`,
    `L${toPoint(end, INNER)}`,
    `A${INNER} ${INNER} 0 0 0 ${toPoint(start, INNER)}`,
    "Z",
  ].join(" ")
}

// The castle door's colour dial. Turning it to a colour opens the door onto
// that part of the site.
export function DoorDial() {
  const active = useActiveSection()
  const navTarget = useSiteStore((state) => state.navTarget)
  const setNavTarget = useSiteStore((state) => state.setNavTarget)
  const doorLink = useDoorLink()
  const activeIndex = sections.findIndex((section) => section.id === active)
  const activeSection = sections[activeIndex]

  // Keep turning the short way round instead of unwinding past 360°.
  const target = -(activeIndex * SEGMENT + SEGMENT / 2)
  const [rotation, setRotation] = useState(target)
  const [lastTarget, setLastTarget] = useState(target)
  if (lastTarget !== target) {
    setLastTarget(target)
    setRotation(rotation + ((((target - rotation) % 360) + 540) % 360) - 180)
  }

  // Below xl the dial would cover the text, so it ducks away while reading
  // downwards and comes back as soon as the visitor scrolls up.
  const { scrollY } = useScroll()
  const [tucked, setTucked] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setTucked(y > previous && y > 240)
  })

  // Hand control back to the scroll position on the first manual scroll.
  useEffect(() => {
    if (!navTarget) return
    const release = () => setNavTarget(null)
    const events = ["wheel", "touchmove", "keydown"] as const
    events.forEach((type) => window.addEventListener(type, release))
    return () =>
      events.forEach((type) => window.removeEventListener(type, release))
  }, [navTarget, setNavTarget])

  return (
    <nav
      aria-label="城堡之门"
      data-tucked={tucked}
      className="fixed right-3 bottom-3 z-40 flex items-end gap-3 transition-transform duration-500 ease-out focus-within:translate-y-0! max-xl:data-[tucked=true]:translate-y-[140%] md:right-auto md:bottom-6 md:left-6"
    >
      <div className="relative size-20 drop-shadow-[0_6px_18px_rgb(30_30_60/0.35)] md:size-32">
        <svg viewBox="-60 -60 120 120" className="size-full">
          <circle r="58" fill="#c9a35a" stroke="#6e5530" strokeWidth="2" />
          <circle r="54" fill="#2f2a33" />
          <motion.g
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
          >
            {sections.map((section, index) => (
              <Tooltip key={section.id}>
                <TooltipTrigger
                  render={
                    <a
                      {...doorLink(section.id)}
                      aria-label={`${section.door}之门，前往${section.label}`}
                      aria-current={section.id === active ? "true" : undefined}
                      className="cursor-pointer outline-none [&:focus-visible>path]:stroke-[#fff3c4] [&:focus-visible>path]:stroke-[3]"
                    />
                  }
                >
                  <path
                    d={wedge(index)}
                    fill={section.color}
                    stroke="#1d1a22"
                    strokeWidth="1"
                    className="transition-[filter] duration-200 hover:brightness-125"
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  {section.door} · {section.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.g>
          <circle r="20" fill="#d8b46a" stroke="#6e5530" strokeWidth="2" />
          <circle r="14" fill="#b38b46" />
          <path
            d="M0 -6 a4 4 0 1 1 0.1 0 Z M-2 -2 h4 l1.5 9 h-7 Z"
            fill="#3a2d1c"
          />
          <path
            d="M0 -59 l-6 -8 h12 Z"
            fill="#fff3c4"
            stroke="#6e5530"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="mb-2 hidden flex-col md:flex">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSection.id}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="rounded-full bg-paper/90 px-3 py-1 text-sm text-ink shadow-sm ring-1 ring-paper-edge backdrop-blur"
          >
            {activeSection.door} · {activeSection.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </nav>
  )
}
