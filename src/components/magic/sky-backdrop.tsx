import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"

// The page travels through one day: morning, noon, golden hour, dusk, night.
// Night falls just before the timeline, the first of the two night sections.
const stops = [0, 0.3, 0.55, 0.68, 0.78]
const skyTop = ["#79b4e4", "#6aa5dc", "#8fa8d2", "#5a4b80", "#0f1733"]
const skyBottom = ["#e4efe9", "#dcebf2", "#f4d8ae", "#ee9c74", "#242e5a"]

// Fixed pseudo-random star field, generated once at module load.
const stars = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) =>
    (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1
  return { x: r(1) * 100, y: r(2) * 70, size: 1 + r(3) * 2.2, delay: r(4) * 4 }
})

export function SkyBackdrop() {
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, stops, skyTop)
  const bottom = useTransform(scrollYProgress, stops, skyBottom)
  const background = useMotionTemplate`linear-gradient(to bottom, ${top}, ${bottom})`
  const starOpacity = useTransform(scrollYProgress, [0.64, 0.78], [0, 1])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background }}
    >
      <motion.div className="absolute inset-0" style={{ opacity: starOpacity }}>
        {stars.map((star, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#fff8dc] shadow-[0_0_6px_#fff3c4]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 3 + star.delay,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
