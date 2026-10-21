import { CastleIcon, MapPinIcon, SparklesIcon } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef, useState } from "react"

import { MeadowLandscape } from "@/components/magic/meadow-landscape"
import { useDoorLink } from "@/components/magic/use-door-link"
import { WalkingCastle } from "@/components/magic/walking-castle"
import { Section } from "@/components/site/section"
import { buttonVariants } from "@/components/ui/button"
import { hero, profile } from "@/content/site"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const
// Break the title after the comma so each half reads as one phrase.
const titleLines = hero.title.split(/(?<=，)/)

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const doorLink = useDoorLink()
  const [castleGlow, setCastleGlow] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const castleX = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"])
  const castleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"])

  return (
    <Section id="home">
      <div ref={ref} className="relative min-h-svh overflow-hidden">
        <MeadowLandscape progress={scrollYProgress} />

        <motion.div
          className="absolute bottom-[6svh] left-[2%] w-[min(58vw,16rem)] md:right-[7%] md:bottom-[9svh] md:left-auto md:w-[min(30vw,25rem)]"
          style={{ x: castleX, y: castleY }}
          onHoverStart={() => setCastleGlow(true)}
          onHoverEnd={() => setCastleGlow(false)}
        >
          <motion.div
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.4, ease }}
          >
            <WalkingCastle glow={castleGlow} className="w-full" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 mx-auto flex max-w-6xl flex-col gap-7 px-5 pt-8 pb-[40svh] md:px-8 md:pt-10 md:pb-[26svh]"
        >
          <header className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-lg font-bold tracking-widest">
              <CastleIcon className="size-5" />
              {profile.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-paper/70 px-3 py-1 text-sm text-muted-foreground ring-1 ring-paper-edge backdrop-blur">
              <MapPinIcon className="size-3.5" />
              {profile.location}
            </span>
          </header>

          <div className="flex max-w-2xl flex-col gap-6 pt-[4svh] md:pt-[5svh]">
            <motion.p
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm tracking-wider text-ink/80 md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              {hero.identity.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-gold">✦</span>}
                  {item}
                </span>
              ))}
            </motion.p>

            <h1
              aria-label={hero.title}
              className="text-4xl leading-tight font-bold tracking-wide text-ink [text-shadow:0_2px_0_rgb(255_255_255/0.5),0_0_30px_rgb(255_255_255/0.6)] md:text-[3.5rem] md:leading-[1.2]"
            >
              {titleLines.map((line, lineIndex) => (
                <span key={line} aria-hidden className="block">
                  {Array.from(line).map((char, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.7,
                        delay: 0.25 + (lineIndex * 6 + i) * 0.05,
                        ease,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              className="max-w-xl text-base leading-8 text-ink/85 [text-shadow:0_0_14px_rgb(255_255_255/0.8)] md:text-lg md:leading-9"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease }}
            >
              {hero.intro}
            </motion.p>

            <motion.div
              className="relative max-w-xl rounded-2xl bg-paper/85 p-4 pl-5 text-sm leading-7 text-ink shadow-[0_10px_30px_-12px_rgb(40_50_80/0.35)] ring-1 ring-paper-edge backdrop-blur md:text-base md:leading-8"
              initial={{ opacity: 0, y: 12, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: -0.6 }}
              transition={{ duration: 0.9, delay: 1.35, ease }}
            >
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-door-projects">
                <SparklesIcon className="size-3.5" />
                正在寻找
              </span>
              {hero.intent}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.6, ease }}
            >
              {hero.actions.map((action, i) => (
                <a
                  key={action.target}
                  {...doorLink(action.target)}
                  className={cn(
                    buttonVariants({
                      variant: i === 0 ? "default" : "outline",
                      size: "lg",
                    }),
                    "h-11 rounded-full px-6 text-base",
                    i === 0 &&
                      "relative overflow-hidden shadow-[0_8px_24px_-8px_rgb(40_60_110/0.6)] before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
                    i > 0 && "bg-paper/80 backdrop-blur"
                  )}
                >
                  {action.label}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
