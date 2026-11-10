import { motion } from "motion/react"
import { useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { art } from "@/content/art"
import { doors, type DoorId } from "@/content/site"
import { cn } from "@/lib/utils"

type Door = (typeof doors)[number]

// Each quadrant of the dial image, matching the door's angle in `doors`.
const quadrants = {
  45: "top-0 right-0 rounded-tr-full",
  135: "right-0 bottom-0 rounded-br-full",
  225: "bottom-0 left-0 rounded-bl-full",
  315: "top-0 left-0 rounded-tl-full",
} as const

type DialFaceProps = {
  active?: DoorId | null
  // Props for the link on each colour (href, onClick, aria-label).
  link: (door: Door) => React.ComponentProps<"a">
  // What the tooltip on each colour says.
  hint: (door: Door) => React.ReactNode
  className?: string
}

// The castle door's colour dial. It turns the short way round to bring the
// active colour under the pointer, and each colour is a link.
export function DialFace({ active, link, hint, className }: DialFaceProps) {
  const activeDoor = doors.find((door) => door.id === active)
  const target = activeDoor ? -activeDoor.angle : 0
  const [rotation, setRotation] = useState(target)
  const [lastTarget, setLastTarget] = useState(target)
  if (lastTarget !== target) {
    setLastTarget(target)
    setRotation(rotation + ((((target - rotation) % 360) + 540) % 360) - 180)
  }

  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 z-10 h-3 w-4 -translate-x-1/2 bg-[#e9c46a] drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
      />
      <motion.div
        className="relative size-full rounded-full drop-shadow-[0_8px_18px_rgb(20_20_40/0.45)]"
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 60, damping: 13 }}
      >
        <img
          src={art.dial.src}
          alt=""
          draggable={false}
          className="size-full select-none"
        />
        {doors.map((door) => (
          <Tooltip key={door.id}>
            <TooltipTrigger
              render={
                <a
                  {...link(door)}
                  aria-current={door.id === active ? "true" : undefined}
                  className={cn(
                    "absolute size-1/2 transition-colors outline-none hover:bg-white/15 focus-visible:bg-white/25",
                    quadrants[door.angle]
                  )}
                />
              }
            />
            <TooltipContent side="top">{hint(door)}</TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </div>
  )
}
