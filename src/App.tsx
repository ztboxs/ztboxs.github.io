import { CastleIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useSyncExternalStore } from "react"

import { ExploreView } from "@/components/explore/explore-view"
import { DoorDial } from "@/components/magic/door-dial"
import { DoorPortal } from "@/components/magic/door-portal"
import { SkyBackdrop } from "@/components/magic/sky-backdrop"
import { StardustTrail } from "@/components/magic/stardust-trail"
import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Explorations } from "@/components/sections/explorations"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { Hero } from "@/components/sections/hero"
import { Timeline } from "@/components/sections/timeline"
import { Button } from "@/components/ui/button"
import { useWorldStore } from "@/stores/world-store"

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2"))
  } catch {
    return false
  }
}

const noop = () => () => {}

export function App() {
  const mode = useWorldStore((state) => state.mode)
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => false)
  const reduceMotion = useReducedMotion()
  // The island needs WebGL 2 and motion; everyone else gets the plain page.
  const canExplore = webgl && !reduceMotion

  if (canExplore && mode === "world") return <ExploreView />
  return <ReadingPage canExplore={canExplore} />
}

// Every word on one scrolling page, for reading straight through.
function ReadingPage({ canExplore }: { canExplore: boolean }) {
  const setMode = useWorldStore((state) => state.setMode)
  return (
    <>
      <SkyBackdrop />
      <StardustTrail />
      <main className="relative">
        <Hero />
        <FeaturedProjects />
        <Explorations />
        <About />
        <Timeline />
        <Contact />
      </main>
      <DoorDial />
      <DoorPortal />
      {canExplore && (
        <Button
          variant="outline"
          onClick={() => {
            window.scrollTo({ top: 0 })
            setMode("world")
          }}
          className="fixed top-4 left-1/2 z-40 h-9 -translate-x-1/2 rounded-full bg-paper/85 px-3.5 backdrop-blur md:top-6"
        >
          <CastleIcon data-icon="inline-start" />
          回到城堡的岛
        </Button>
      )}
    </>
  )
}

export default App
