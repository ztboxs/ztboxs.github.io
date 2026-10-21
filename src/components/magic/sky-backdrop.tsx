import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"

import { Cloud } from "@/components/magic/cloud"

// The page travels through one day: morning, noon, golden hour, dusk, night.
const stops = [0, 0.3, 0.55, 0.75, 0.92]
const skyTop = ["#79b4e4", "#5f9ad4", "#86a2cf", "#57497f", "#101834"]
const skyBottom = ["#eef6f1", "#d6eaf3", "#f6d6a8", "#f09a72", "#26305c"]
const cloudLight = ["#fffdf8", "#ffffff", "#fff1d8", "#ffc9a6", "#46507e"]
const cloudShade = ["#c7d4ea", "#bfd0e8", "#e7b48c", "#9a6d93", "#1c2448"]

// Fixed pseudo-random star field, generated once at module load.
const stars = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) =>
    (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1
  return { x: r(1) * 100, y: r(2) * 70, size: 1 + r(3) * 2.2, delay: r(4) * 4 }
})

const clouds = [
  {
    top: "8%",
    left: "-6%",
    width: "34rem",
    speed: -260,
    drift: 40,
    opacity: 0.95,
  },
  {
    top: "20%",
    left: "58%",
    width: "26rem",
    speed: -420,
    drift: -30,
    opacity: 0.9,
  },
  {
    top: "46%",
    left: "18%",
    width: "20rem",
    speed: -620,
    drift: 26,
    opacity: 0.75,
  },
  {
    top: "62%",
    left: "70%",
    width: "30rem",
    speed: -340,
    drift: -36,
    opacity: 0.85,
  },
  {
    top: "80%",
    left: "-10%",
    width: "24rem",
    speed: -520,
    drift: 30,
    opacity: 0.7,
  },
]

export function SkyBackdrop() {
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, stops, skyTop)
  const bottom = useTransform(scrollYProgress, stops, skyBottom)
  const background = useMotionTemplate`linear-gradient(to bottom, ${top}, ${bottom})`
  const light = useTransform(scrollYProgress, stops, cloudLight)
  const shade = useTransform(scrollYProgress, stops, cloudShade)
  const starOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1])
  const sunOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.8, 0])
  const sunY = useTransform(scrollYProgress, [0, 0.75], ["0vh", "70vh"])
  const sunColor = useTransform(
    scrollYProgress,
    [0, 0.5, 0.72],
    ["#fff6d6", "#ffe7a8", "#ff9f6b"]
  )
  const cloudLayerY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background }}
    >
      <motion.div
        className="absolute top-[6vh] right-[12vw] size-40 rounded-full blur-2xl md:size-64"
        style={{ opacity: sunOpacity, y: sunY, backgroundColor: sunColor }}
      />
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
      <motion.div
        className="absolute inset-0"
        style={
          {
            y: cloudLayerY,
            "--cloud-light": light,
            "--cloud-shade": shade,
          } as never
        }
      >
        {clouds.map((cloud) => (
          <ParallaxCloud key={cloud.top} {...cloud} />
        ))}
      </motion.div>
      <div className="absolute inset-0 paper-grain opacity-[0.18] mix-blend-multiply" />
    </motion.div>
  )
}

function ParallaxCloud({
  top,
  left,
  width,
  speed,
  drift,
  opacity,
}: (typeof clouds)[number]) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 4000], [0, speed])

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ top, left, width, y, opacity }}
      animate={{ x: [0, drift, 0] }}
      transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
    >
      <Cloud className="w-full" />
    </motion.div>
  )
}
