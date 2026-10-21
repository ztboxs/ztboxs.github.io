import { motion, useAnimate, useReducedMotion } from "motion/react"
import { useEffect } from "react"

import { sections } from "@/content/site"
import { useSiteStore } from "@/stores/site-store"

const sparks = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 3) * 0.2
  const distance = 120 + ((i * 53) % 140)
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
})

// Walking through a door: light pours out of the dial in the door's colour,
// the castle lands somewhere else, and the light fades away.
export function DoorPortal() {
  const doorTarget = useSiteStore((state) => state.doorTarget)
  const origin = useSiteStore((state) => state.doorOrigin)
  const closeDoor = useSiteStore((state) => state.closeDoor)
  const reduceMotion = useReducedMotion()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const door = sections.find((section) => section.id === doorTarget)

  useEffect(() => {
    if (!doorTarget) return
    const target = document.getElementById(doorTarget)
    if (reduceMotion || !scope.current) {
      target?.scrollIntoView({ behavior: "smooth" })
      closeDoor()
      return
    }

    let cancelled = false
    const at = `${origin.x}px ${origin.y}px`
    const run = async () => {
      await animate(
        scope.current,
        {
          clipPath: [`circle(0px at ${at})`, `circle(150vmax at ${at})`],
          opacity: [1, 1],
        },
        { duration: 0.7, ease: [0.65, 0, 0.35, 1] }
      )
      if (cancelled) return
      target?.scrollIntoView({ behavior: "instant", block: "start" })
      await animate(
        scope.current,
        { opacity: 0, filter: ["blur(0px)", "blur(12px)"] },
        { duration: 0.7, ease: "easeOut", delay: 0.15 }
      )
      if (!cancelled) closeDoor()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [doorTarget, origin, reduceMotion, animate, scope, closeDoor])

  if (!door || reduceMotion) return null

  return (
    <div
      ref={scope}
      aria-hidden
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={
        {
          "--door": door.color,
          clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
          background: `radial-gradient(circle at ${origin.x}px ${origin.y}px, #fff6d8 0%, var(--door) 45%, color-mix(in oklch, var(--door) 60%, #0b1030) 100%)`,
        } as React.CSSProperties
      }
    >
      {sparks.map((spark, i) => (
        <motion.span
          key={i}
          className="absolute size-1.5 rounded-full bg-[#fff3c4] shadow-[0_0_10px_3px_#ffe08a]"
          style={{ left: origin.x, top: origin.y }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: spark.x * 3,
            y: spark.y * 3,
            opacity: [0, 1, 0],
            scale: [0.4, 1.4, 0.6],
          }}
          transition={{ duration: 1.1, ease: "easeOut", delay: (i % 4) * 0.04 }}
        />
      ))}
      <motion.div
        className="relative flex flex-col items-center gap-2 text-center text-[#fffaf0] [text-shadow:0_2px_18px_rgb(0_0_0/0.25)]"
        initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <span className="font-fell text-sm tracking-[0.3em] uppercase italic opacity-80">
          the door opens
        </span>
        <span className="text-3xl font-bold tracking-widest md:text-5xl">
          {door.door} · {door.label}
        </span>
      </motion.div>
    </div>
  )
}
