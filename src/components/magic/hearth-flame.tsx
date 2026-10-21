import { motion } from "motion/react"

import { cn } from "@/lib/utils"

type HearthFlameProps = {
  // 0 is a quiet ember, 1 is a roaring fire.
  intensity?: number
  className?: string
}

// A small hearth fire. Feeding it (raising intensity) makes it leap higher.
export function HearthFlame({ intensity = 0, className }: HearthFlameProps) {
  const lift = 1 + intensity * 0.35

  return (
    <svg
      viewBox="0 0 120 150"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <motion.ellipse
        cx="60"
        cy="96"
        rx="58"
        ry="54"
        fill="#ffb347"
        filter="url(#paint-glow)"
        animate={{ opacity: [0.28, 0.42, 0.28], scale: lift }}
        transition={{
          opacity: { duration: 2.2, repeat: Infinity },
          scale: { type: "spring", stiffness: 120, damping: 12 },
        }}
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        animate={{ scaleY: lift, scaleX: 1 + intensity * 0.08 }}
        transition={{ type: "spring", stiffness: 140, damping: 11 }}
      >
        {[
          {
            d: "M60 140 C24 132 22 96 40 78 C40 96 50 98 52 88 C50 66 62 46 74 30 C72 54 96 66 96 98 C96 124 84 140 60 140 Z",
            fill: "#f0703a",
            dur: 1.3,
          },
          {
            d: "M60 140 C36 134 34 108 46 94 C48 106 56 106 56 98 C56 82 64 70 72 60 C72 80 86 90 86 110 C86 128 76 140 60 140 Z",
            fill: "#ffa443",
            dur: 1.05,
          },
          {
            d: "M60 140 C46 136 44 120 52 110 C54 118 60 118 60 112 C60 102 64 96 68 90 C70 102 76 110 76 122 C76 134 70 140 60 140 Z",
            fill: "#ffe08a",
            dur: 0.85,
          },
        ].map((layer) => (
          <motion.path
            key={layer.fill}
            d={layer.d}
            fill={layer.fill}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            animate={{ scaleY: [1, 1.08, 0.96, 1], skewX: [0, 3, -3, 0] }}
            transition={{
              duration: layer.dur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.g>
      <g stroke="#5a3a28" strokeWidth="9" strokeLinecap="round">
        <path d="M22 146 L94 134" />
        <path d="M28 134 L100 146" />
      </g>
    </svg>
  )
}
