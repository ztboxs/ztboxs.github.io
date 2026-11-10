import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"

import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Explorations } from "@/components/sections/explorations"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { Timeline } from "@/components/sections/timeline"
import { Button } from "@/components/ui/button"
import { doors, sections, type DoorId, type SectionId } from "@/content/site"
import { cn } from "@/lib/utils"
import { useWorldStore } from "@/stores/world-store"

const sectionViews: Partial<Record<SectionId, () => React.JSX.Element>> = {
  projects: FeaturedProjects,
  explorations: Explorations,
  about: About,
  timeline: Timeline,
  contact: Contact,
}

// Each door's page is tinted like the place it opens onto.
const backdrops: Record<DoorId, string> = {
  harbor: "bg-linear-to-b from-[#cfe2f1] to-[#e9f1ee]",
  meadow: "bg-linear-to-b from-[#dbe8cb] to-[#f1eedb]",
  hearth: "bg-linear-to-b from-[#f3dcc0] to-[#f6ead8]",
  night: "dark bg-linear-to-b from-[#141c3d] to-[#26305c] text-foreground",
}

// The page behind a door. It opens beside the island on wide screens and
// rises from the bottom on phones, leaving the place itself in view.
export function PlacePanel() {
  const focus = useWorldStore((state) => state.focus)
  const setFocus = useWorldStore((state) => state.setFocus)
  const door = doors.find((candidate) => candidate.id === focus)
  const shown = sections.filter((section) => section.door === focus)

  useEffect(() => {
    if (!focus) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocus(null)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [focus, setFocus])

  return (
    <AnimatePresence>
      {door && (
        <motion.aside
          key={door.id}
          role="dialog"
          aria-label={`${door.name}之门 · ${door.label}`}
          className={cn(
            "fixed inset-x-0 top-[34svh] bottom-0 z-40 overflow-y-auto overscroll-contain rounded-t-[2rem] shadow-[0_-20px_60px_-20px_rgb(10_15_40/0.5)] ring-1 ring-white/40 md:inset-y-3 md:top-3 md:right-3 md:left-auto md:w-[min(46rem,54vw)] md:rounded-[2rem]",
            backdrops[door.id]
          )}
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sticky top-0 z-20 flex justify-end px-4 pt-3 md:px-6 md:pt-5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFocus(null)}
              aria-label="关上这扇门，回到岛上"
              className="rounded-full bg-paper/80 backdrop-blur-md"
            >
              <XIcon />
            </Button>
          </div>
          <div className="-mt-12">
            {shown.map((section) => {
              const View = sectionViews[section.id]
              return View ? <View key={section.id} /> : null
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
