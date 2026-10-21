import { motion } from "motion/react"

const shootingStars = [
  { top: "6%", left: "72%", delay: 1.2, repeatDelay: 7 },
  { top: "18%", left: "38%", delay: 4.5, repeatDelay: 9 },
  { top: "2%", left: "92%", delay: 8, repeatDelay: 11 },
]

// Stars that fall across the night sky every now and then.
export function FallingStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {shootingStars.map((star) => (
        <motion.span
          key={star.left}
          className="absolute h-px w-28 origin-right rotate-[-35deg] bg-linear-to-l from-[#fff6cf] via-[#ffe08a]/60 to-transparent"
          style={{ top: star.top, left: star.left }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: -260, y: 180 }}
          transition={{
            duration: 1.4,
            ease: "easeIn",
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: star.repeatDelay,
          }}
        >
          <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_#ffe9a8]" />
        </motion.span>
      ))}
    </div>
  )
}
