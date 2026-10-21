import { motion, useTransform, type MotionValue } from "motion/react"

const flowerColors = ["#fffaf0", "#ffd75e", "#f4a6b8", "#b9d3ff", "#fffaf0"]

// Deterministic flower scatter so the meadow looks the same on every visit.
const flowers = Array.from({ length: 140 }, (_, i) => {
  const r = (n: number) =>
    (((Math.sin(i * 91.7 + n * 47.3) * 24634.6345) % 1) + 1) % 1
  const near = i % 3 === 0
  return {
    x: r(1) * 1440,
    y: near ? 478 + r(2) * 38 : 404 + r(2) * 70,
    r: near ? 2.4 + r(3) * 1.6 : 1.2 + r(3) * 1.2,
    color: flowerColors[i % flowerColors.length],
  }
})

const trees = [
  [210, 318, 16],
  [232, 322, 12],
  [1010, 306, 18],
  [1034, 312, 13],
  [1052, 316, 10],
  [690, 314, 11],
] as const

type MeadowLandscapeProps = { progress: MotionValue<number> }

export function MeadowLandscape({ progress }: MeadowLandscapeProps) {
  const farY = useTransform(progress, [0, 1], [0, 40])
  const midY = useTransform(progress, [0, 1], [0, 70])

  return (
    <svg
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[34svh] w-full md:h-[48svh]"
    >
      <defs>
        <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa9cc" />
          <stop offset="1" stopColor="#b9cde0" />
        </linearGradient>
        <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b5d79a" />
          <stop offset="1" stopColor="#93bf7c" />
        </linearGradient>
        <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8cc06f" />
          <stop offset="1" stopColor="#6aa35a" />
        </linearGradient>
        <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f9a52" />
          <stop offset="1" stopColor="#3f7442" />
        </linearGradient>
      </defs>
      <g filter="url(#paint-wobble)">
        <motion.g style={{ y: farY }}>
          <path
            d="M0 300 L120 214 L210 262 L330 150 L450 252 L560 192 L700 272 L820 168 L960 262 L1080 202 L1200 252 L1320 158 L1440 232 V520 H0 Z"
            fill="url(#mountain)"
            opacity="0.85"
          />
          {[
            [330, 150],
            [820, 168],
            [1320, 158],
          ].map(([x, y]) => (
            <path
              key={x}
              d={`M${x - 30} ${y + 28} L${x} ${y} L${x + 32} ${y + 30} L${x + 16} ${y + 24} L${x + 2} ${y + 34} L${x - 12} ${y + 22} Z`}
              fill="#f7f9fc"
            />
          ))}
          <path
            d="M0 360 C200 300 380 330 560 320 C760 305 900 290 1100 320 C1260 340 1360 320 1440 310 V520 H0 Z"
            fill="url(#hill-far)"
          />
          {trees.map(([x, y, r]) => (
            <g key={x}>
              <rect x={x - 2} y={y} width="4" height={r} fill="#4c5f3a" />
              <circle cx={x} cy={y - r * 0.2} r={r} fill="#4f8a4a" />
              <circle
                cx={x - r * 0.35}
                cy={y - r * 0.5}
                r={r * 0.55}
                fill="#6aa35a"
              />
            </g>
          ))}
        </motion.g>
        <motion.g style={{ y: midY }}>
          <path
            d="M0 420 C240 360 420 380 640 395 C860 410 1020 350 1240 360 C1340 365 1400 380 1440 385 V520 H0 Z"
            fill="url(#hill-mid)"
          />
        </motion.g>
        <path
          d="M0 470 C200 440 420 455 640 470 C900 488 1100 450 1440 460 V520 H0 Z"
          fill="url(#hill-near)"
        />
        {flowers.map((flower, i) => (
          <circle
            key={i}
            cx={flower.x}
            cy={flower.y}
            r={flower.r}
            fill={flower.color}
            opacity="0.9"
          />
        ))}
      </g>
    </svg>
  )
}
