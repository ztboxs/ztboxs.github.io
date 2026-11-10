import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import { useEffect, useState } from "react"

import { DialFace } from "@/components/magic/dial-face"
import { useDoorLink } from "@/components/magic/use-door-link"
import { doors, sections, type SectionId } from "@/content/site"
import { useActiveSection, useSiteStore } from "@/stores/site-store"

const sectionLabel = (id: SectionId) =>
  sections.find((section) => section.id === id)?.label

// The castle door's colour dial. Turning it to a colour opens the door onto
// that place.
export function DoorDial() {
  const active = useActiveSection()
  const navTarget = useSiteStore((state) => state.navTarget)
  const setNavTarget = useSiteStore((state) => state.setNavTarget)
  const doorLink = useDoorLink()
  const activeSection = sections.find((section) => section.id === active)!
  const activeDoor = doors.find((door) => door.id === activeSection.door)

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
      <DialFace
        active={activeDoor?.id}
        className="size-20 md:size-32"
        link={(door) => ({
          ...doorLink(door.target),
          "aria-label": `${door.name}之门，前往${sectionLabel(door.target)}`,
        })}
        hint={(door) => `${door.name} · ${sectionLabel(door.target)}`}
      />
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
