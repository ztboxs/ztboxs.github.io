import { motion } from "motion/react"

import { art } from "@/content/art"
import { cn } from "@/lib/utils"

type CalciferProps = {
  // 0 is a quiet hearth, 1 is a fire that has just been fed.
  intensity?: number
  className?: string
}

// The hearth's fire demon. It flickers on its own and leaps when fed.
export function Calcifer({ intensity = 0, className }: CalciferProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        aria-hidden
        className="absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgb(255_190_90/0.75),rgb(255_120_40/0.25)_45%,transparent_70%)] blur-xl"
        animate={{ opacity: [0.65, 0.9, 0.7], scale: 1 + intensity * 0.25 }}
        transition={{
          opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 120, damping: 12 },
        }}
      />
      <motion.div
        style={{ originY: 1 }}
        animate={{ scale: 1 + intensity * 0.18 }}
        transition={{ type: "spring", stiffness: 160, damping: 10 }}
      >
        <motion.img
          src={art.calcifer.src}
          alt="炉火里的火焰恶魔卡西法"
          width={art.calcifer.width}
          height={art.calcifer.height}
          loading="lazy"
          draggable={false}
          className="relative w-full select-none"
          style={{ originY: 1 }}
          animate={{
            scaleY: [1, 1.05, 0.98, 1.03, 1],
            scaleX: [1, 0.98, 1.02, 0.99, 1],
            rotate: [0, -1.5, 1, -0.5, 0],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}
