import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

type Mote = { id: number; x: number; y: number; drift: number; size: number }

const MAX_MOTES = 26
const SPAWN_GAP_MS = 34

// Walking on air: the pointer leaves a short trail of stardust behind it.
export function StardustTrail() {
  const reduceMotion = useReducedMotion()
  const [motes, setMotes] = useState<Mote[]>([])

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return
    let last = 0
    let id = 0
    const onMove = (event: PointerEvent) => {
      if (event.timeStamp - last < SPAWN_GAP_MS) return
      last = event.timeStamp
      id += 1
      const mote = {
        id,
        x: event.clientX,
        y: event.clientY,
        drift: ((id * 37) % 21) - 10,
        size: 6 + ((id * 13) % 7),
      }
      setMotes((current) => [...current.slice(-MAX_MOTES + 1), mote])
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduceMotion])

  const remove = (id: number) =>
    setMotes((current) => current.filter((mote) => mote.id !== id))

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <AnimatePresence>
        {motes.map((mote) => (
          <motion.svg
            key={mote.id}
            viewBox="-10 -10 20 20"
            className="absolute"
            style={{
              left: mote.x,
              top: mote.y,
              width: mote.size,
              height: mote.size,
              marginLeft: -mote.size / 2,
              marginTop: -mote.size / 2,
            }}
            initial={{ opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 0.2,
              y: 26,
              x: mote.drift,
              rotate: 90,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onAnimationComplete={() => remove(mote.id)}
          >
            <path
              d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z"
              fill="#fff6cf"
              style={{ filter: "drop-shadow(0 0 3px #ffd56b)" }}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  )
}
