import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const ink = "#2c3548"
const stroke = {
  stroke: ink,
  strokeWidth: 1.6,
  strokeLinejoin: "round",
} as const
const windowFill = "#ffd98a"

// Hip x positions; legs alternate phase so the castle seems to plod along.
const legs = [
  { x: 116, phase: 0, back: true },
  { x: 236, phase: 0.5, back: true },
  { x: 150, phase: 0.5, back: false },
  { x: 268, phase: 0, back: false },
]
const STEP = 1.6

function Leg({ x, phase, back }: (typeof legs)[number]) {
  const tone = back ? "#4a3c38" : "#5f4c45"
  return (
    <motion.g
      style={{ transformBox: "view-box", transformOrigin: `${x}px 262px` }}
      animate={{ rotate: [-9, 9, -9] }}
      transition={{
        duration: STEP,
        repeat: Infinity,
        ease: "easeInOut",
        delay: -phase * STEP,
      }}
    >
      <path
        d={`M${x} 262 L${x - 10} 322`}
        stroke={tone}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <motion.g
        style={{
          transformBox: "view-box",
          transformOrigin: `${x - 10}px 322px`,
        }}
        animate={{ rotate: [10, -6, 10] }}
        transition={{
          duration: STEP,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -phase * STEP,
        }}
      >
        <path
          d={`M${x - 10} 322 L${x + 4} 384`}
          stroke={tone}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={`M${x - 10} 392 Q${x + 4} 380 ${x + 20} 392 Z`}
          fill={tone}
          {...stroke}
        />
      </motion.g>
      <circle cx={x - 10} cy="322" r="6.5" fill="#a5865f" {...stroke} />
    </motion.g>
  )
}

function Smoke({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="9"
          fill="#f7f3ec"
          initial={{ opacity: 0 }}
          animate={{
            x: [0, 10, 22],
            y: [0, -38, -80],
            scale: [0.4, 1.2, 1.9],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            delay: i * 1.4,
            ease: "easeOut",
          }}
        />
      ))}
    </g>
  )
}

function Window({ d, glow }: { d: string; glow: boolean }) {
  return (
    <g>
      <motion.path
        d={d}
        fill="#ffc35a"
        filter="url(#paint-glow)"
        animate={{ opacity: glow ? 0.95 : 0.45 }}
        transition={{ duration: 0.6 }}
      />
      <path d={d} fill={windowFill} {...stroke} strokeWidth="1.2" />
    </g>
  )
}

const windows = [
  "M86 150 V138 a6 6 0 0 1 12 0 V150 Z",
  "M86 182 V170 a6 6 0 0 1 12 0 V182 Z",
  "M134 158 h14 v18 h-14 Z",
  "M156 158 h12 v18 h-12 Z",
  "M206 158 h12 v18 h-12 Z",
  "M224 158 h10 v18 h-10 Z",
  "M203 82 h9 v11 h-9 Z",
  "M174 106 h14 v12 h-14 Z",
  "M248 162 h12 v14 h-12 Z",
  "M276 162 h12 v14 h-12 Z",
]

type WalkingCastleProps = {
  className?: string
  glow?: boolean
}

export function WalkingCastle({ className, glow = false }: WalkingCastleProps) {
  return (
    <svg
      viewBox="0 0 360 400"
      role="img"
      aria-label="一座在草原上缓缓行走的蒸汽城堡"
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id="castle-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f7564" />
          <stop offset="1" stopColor="#5b4842" />
        </linearGradient>
        <linearGradient id="castle-copper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c48a56" />
          <stop offset="1" stopColor="#8d5d3a" />
        </linearGradient>
      </defs>

      <ellipse
        cx="190"
        cy="394"
        rx="130"
        ry="9"
        fill="#2f4a2a"
        opacity="0.18"
      />

      <g filter="url(#paint-wobble)">
        {legs
          .filter((leg) => leg.back)
          .map((leg) => (
            <Leg key={leg.x} {...leg} />
          ))}

        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: STEP / 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Smoke x={156} y={84} />
          <Smoke x={290} y={96} />

          {/* Hull */}
          <path
            d="M58 196 C48 236 70 268 112 272 L254 274 C296 270 318 238 306 196 Z"
            fill="url(#castle-hull)"
            {...stroke}
          />
          <path
            d="M56 212 C120 224 250 224 308 212"
            stroke="#d1aa5e"
            strokeWidth="5"
            fill="none"
          />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={82 + i * 22} cy={236} r="2" fill="#3a2e2b" />
          ))}
          <circle cx="132" cy="250" r="9" fill="#ffd98a" {...stroke} />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle
              cx="296"
              cy="240"
              r="14"
              fill="#8a6a45"
              stroke="#c99a58"
              strokeWidth="6"
              strokeDasharray="4 3.3"
            />
            <circle cx="296" cy="240" r="4" fill="#3a2e2b" />
          </motion.g>
          <path
            d="M302 178 C322 184 320 206 306 216"
            stroke="url(#castle-copper)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Left round tower */}
          <rect
            x="72"
            y="104"
            width="58"
            height="96"
            fill="#ece1c7"
            {...stroke}
          />
          <rect
            x="112"
            y="104"
            width="18"
            height="96"
            fill="#000"
            opacity="0.07"
          />
          {[124, 160, 192].map((y) => (
            <path
              key={y}
              d={`M76 ${y} h14 M104 ${y + 6} h18`}
              stroke="#b8a682"
              strokeWidth="1.4"
            />
          ))}
          <path d="M64 108 L101 30 L138 108 Z" fill="#4f6690" {...stroke} />
          <path d="M101 30 L138 108 L120 108 Z" fill="#000" opacity="0.16" />
          <path d="M101 30 V8" stroke={ink} strokeWidth="1.6" />
          <motion.path
            d="M101 9 Q113 5 124 11 Q113 16 101 18 Z"
            fill="#c0533a"
            {...stroke}
            strokeWidth="1.2"
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
            animate={{ scaleX: [1, 0.82, 1], skewY: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect
            x="64"
            y="186"
            width="74"
            height="5"
            fill="#6b5a52"
            {...stroke}
            strokeWidth="1.2"
          />
          {[70, 82, 94, 106, 118, 130].map((x) => (
            <path
              key={x}
              d={`M${x} 186 v-9`}
              stroke="#6b5a52"
              strokeWidth="2"
            />
          ))}
          <path d="M66 177 H136" stroke="#6b5a52" strokeWidth="2" />

          {/* Main timbered house */}
          <rect
            x="126"
            y="128"
            width="112"
            height="70"
            fill="#f3e8cf"
            {...stroke}
          />
          <g stroke="#7a5a44" strokeWidth="3" fill="none">
            <path d="M126 150 H238" />
            <path d="M150 128 V150 M182 128 V150 M214 128 V150" />
            <path d="M126 150 L150 128 M182 150 L214 128" />
          </g>
          <rect
            x="126"
            y="128"
            width="112"
            height="7"
            fill="#000"
            opacity="0.1"
          />
          <path d="M150 120 V88 h12 V120" fill="#6b5a52" {...stroke} />
          <path
            d="M148 88 h16 v-5 h-16 Z"
            fill="#4a3c38"
            {...stroke}
            strokeWidth="1.2"
          />
          <path d="M116 132 L182 82 L248 132 Z" fill="#b9573d" {...stroke} />
          <path d="M182 82 L248 132 L224 132 Z" fill="#000" opacity="0.15" />
          <path
            d="M140 120 L182 96 M150 128 L190 104"
            stroke="#8e3f2c"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <path
            d="M170 120 v-16 h18 v16 Z"
            fill="#e9dcc0"
            {...stroke}
            strokeWidth="1.2"
          />
          <path
            d="M167 105 L179 96 L191 105 Z"
            fill="#8e3f2c"
            {...stroke}
            strokeWidth="1.2"
          />

          {/* Door with a little colour dial */}
          <path
            d="M176 198 V180 a11 11 0 0 1 22 0 V198 Z"
            fill="#6b4a3a"
            {...stroke}
          />
          <g transform="translate(187 164)">
            <path d="M0 0 L0 -6 A6 6 0 0 1 6 0 Z" fill="#6fa8d6" />
            <path d="M0 0 L6 0 A6 6 0 0 1 0 6 Z" fill="#c0533a" />
            <path d="M0 0 L0 6 A6 6 0 0 1 -6 0 Z" fill="#6f9a54" />
            <path d="M0 0 L-6 0 A6 6 0 0 1 0 -6 Z" fill="#2c3a6b" />
            <circle r="6" fill="none" {...stroke} strokeWidth="1.2" />
          </g>

          {/* Little turret on the roof */}
          <rect
            x="196"
            y="70"
            width="26"
            height="40"
            fill="#ddd2bd"
            {...stroke}
          />
          <path d="M190 72 L209 36 L228 72 Z" fill="#4f6690" {...stroke} />
          <path d="M209 36 L228 72 L218 72 Z" fill="#000" opacity="0.16" />

          {/* Right cottage */}
          <rect
            x="236"
            y="146"
            width="66"
            height="52"
            fill="#bccbd0"
            {...stroke}
          />
          <rect
            x="286"
            y="146"
            width="16"
            height="52"
            fill="#000"
            opacity="0.08"
          />
          <path d="M228 150 L269 116 L310 150 Z" fill="#5d8b7b" {...stroke} />
          <path d="M269 116 L310 150 L292 150 Z" fill="#000" opacity="0.15" />
          <rect
            x="285"
            y="98"
            width="10"
            height="34"
            fill="url(#castle-copper)"
            {...stroke}
            strokeWidth="1.2"
          />
          <rect
            x="282"
            y="94"
            width="16"
            height="6"
            fill="#8d5d3a"
            {...stroke}
            strokeWidth="1.2"
          />

          {windows.map((d) => (
            <Window key={d} d={d} glow={glow} />
          ))}
        </motion.g>

        {legs
          .filter((leg) => !leg.back)
          .map((leg) => (
            <Leg key={leg.x} {...leg} />
          ))}
      </g>
    </svg>
  )
}
