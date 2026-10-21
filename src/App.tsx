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

export function App() {
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
    </>
  )
}

export default App
