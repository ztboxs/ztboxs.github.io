import { motion } from "motion/react"

import type { Art } from "@/content/art"
import { cn } from "@/lib/utils"

const motes = Array.from({ length: 9 }, (_, i) => {
  const angle = (i / 9) * Math.PI * 2 + 0.4
  const distance = 46 + ((i * 29) % 30)
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance * 0.8 }
})

type OrnamentProps = {
  art: Art
  className?: string
  delay?: number
}

// A small painted keepsake. It appears in a puff of gold dust, then floats
// on its own and gives a little shake when touched.
export function Ornament({ art, className, delay = 0 }: OrnamentProps) {
  return (
    <motion.div
      aria-hidden
      className={cn("relative select-none", className)}
      initial={{ opacity: 0, scale: 0.6, rotate: -10, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
      whileHover={{ rotate: [0, -7, 5, -2, 0], transition: { duration: 0.8 } }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {motes.map((mote, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-1/2 left-1/2 size-1.5 rounded-full bg-[#fff3c4] shadow-[0_0_8px_2px_#ffd56b]"
          initial={{ x: 0, y: 0, opacity: 0 }}
          whileInView={{
            x: mote.x,
            y: mote.y,
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0.5],
          }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: delay + 0.15 + (i % 3) * 0.06 }}
        />
      ))}
      <motion.img
        src={art.src}
        width={art.width}
        height={art.height}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="relative w-full drop-shadow-[0_10px_14px_rgb(30_35_60/0.18)]"
        animate={{ y: [0, -7, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}
