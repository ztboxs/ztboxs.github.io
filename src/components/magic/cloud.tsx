import { useId } from "react"

import { cn } from "@/lib/utils"

// A cumulus built from overlapping puffs with a flat, shaded underside.
// Colours come from --cloud-light and --cloud-shade so the sky can tint it.
const puffs = [
  [70, 92, 46],
  [128, 66, 58],
  [196, 54, 70],
  [268, 72, 56],
  [326, 94, 40],
  [160, 104, 44],
  [240, 106, 42],
] as const

export function Cloud({ className }: { className?: string }) {
  const gradientId = `cloud${useId().replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <svg
      viewBox="0 0 400 150"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0.35"
            style={{ stopColor: "var(--cloud-light, #fffdf8)" }}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--cloud-shade, #c9d3e6)" }}
          />
        </linearGradient>
      </defs>
      <g filter="url(#paint-cloud)" fill={`url(#${gradientId})`}>
        {puffs.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
        <rect x="40" y="96" width="320" height="38" rx="19" />
      </g>
    </svg>
  )
}
