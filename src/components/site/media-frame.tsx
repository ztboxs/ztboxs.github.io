import { ClapperboardIcon, ImageIcon } from "lucide-react"
import { motion } from "motion/react"

import type { Media } from "@/content/site"
import { cn } from "@/lib/utils"

type MediaFrameProps = {
  media: Media
  project: string
  tilt?: number
  className?: string
}

// A photo pinned onto the page. Without a src it is an honest placeholder that
// names the project, the asset needed and any anonymisation requirement.
export function MediaFrame({
  media,
  project,
  tilt = 0,
  className,
}: MediaFrameProps) {
  const Icon = media.kind === "video" ? ClapperboardIcon : ImageIcon
  const aspect = media.kind === "video" ? "aspect-video" : "aspect-[4/3]"

  return (
    <motion.figure
      className={cn(
        "relative rounded-sm bg-[#fffdf7] p-2 pb-3 shadow-[0_8px_20px_-8px_rgb(40_40_60/0.45)] ring-1 ring-black/5",
        className
      )}
      initial={{ rotate: tilt }}
      whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-3deg] bg-[#e9dcb6]/80 shadow-sm"
      />
      {media.src ? (
        media.kind === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            controls
            preload="metadata"
            className={cn("w-full rounded-[2px] object-cover", aspect)}
          />
        ) : (
          <img
            src={media.src}
            alt={media.alt ?? media.label}
            loading="lazy"
            className={cn("w-full rounded-[2px] object-cover", aspect)}
          />
        )
      ) : (
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-[2px] border border-dashed border-[#c9b994] bg-[repeating-linear-gradient(135deg,#f7f0de_0_10px,#f2e9d2_10px_20px)] p-3 text-center",
            aspect
          )}
        >
          <Icon className="size-5 text-[#9b8a66]" />
          <span className="text-xs leading-5 text-[#6d5f45]">{project}</span>
        </div>
      )}
      <figcaption className="mt-2 px-0.5 text-xs leading-5 text-ink/80">
        {media.src ? media.label : `[${media.label}]`}
        {media.note && (
          <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
            {media.note}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
}
