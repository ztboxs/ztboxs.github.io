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
import { art } from "@/content/art"
import { doors, sections } from "@/content/site"
import { cn } from "@/lib/utils"
import { useActiveSection, useSiteStore } from "@/stores/site-store"

// Each quadrant of the dial image, matching the door's angle in `doors`.
const quadrants = {
  45: "top-0 right-0 rounded-tr-full",
  135: "right-0 bottom-0 rounded-br-full",
  225: "bottom-0 left-0 rounded-bl-full",
  315: "top-0 left-0 rounded-tl-full",
} as const

// The castle door's colour dial. Turning it to a colour opens the door onto
// that place.
export function DoorDial() {
  const active = useActiveSection()
  const navTarget = useSiteStore((state) => state.navTarget)
  const setNavTarget = useSiteStore((state) => state.setNavTarget)
  const doorLink = useDoorLink()
  const activeSection = sections.find((section) => section.id === active)!
  const activeDoor = doors.find((door) => door.id === activeSection.door)

  // Keep turning the short way round instead of unwinding past 360°.
  const target = activeDoor ? -activeDoor.angle : 0
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
      <div className="relative size-20 md:size-32">
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 z-10 h-3 w-4 -translate-x-1/2 bg-[#e9c46a] drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
        />
        <motion.div
          className="relative size-full rounded-full drop-shadow-[0_8px_18px_rgb(20_20_40/0.45)]"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 13 }}
        >
          <img
            src={art.dial.src}
            alt=""
            draggable={false}
            className="size-full select-none"
          />
          {doors.map((door) => (
            <Tooltip key={door.id}>
              <TooltipTrigger
                render={
                  <a
                    {...doorLink(door.target)}
                    aria-label={`${door.name}之门，前往${sections.find((section) => section.id === door.target)?.label}`}
                    aria-current={
                      door.id === activeDoor?.id ? "true" : undefined
                    }
                    className={cn(
                      "absolute size-1/2 transition-colors outline-none hover:bg-white/15 focus-visible:bg-white/25",
                      quadrants[door.angle]
                    )}
                  />
                }
              />
              <TooltipContent side="top">
                {door.name} ·{" "}
                {sections.find((section) => section.id === door.target)?.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </div>
      <div className="mb-2 hidden flex-col md:flex">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSection.id}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-paper/90 px-3 py-1 text-sm text-ink shadow-sm ring-1 ring-paper-edge backdrop-blur"
          >
            {activeDoor && (
              <span
                className="size-2.5 rounded-full ring-2 ring-black/10"
                style={{ backgroundColor: activeDoor.color }}
              />
            )}
            {activeDoor ? `${activeDoor.name} · ` : ""}
            {activeSection.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </nav>
  )
}
