import { CastleIcon, MapPinIcon, SparklesIcon } from "lucide-react"
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { lazy, Suspense, useRef, useSyncExternalStore } from "react"

import { useDoorLink } from "@/components/magic/use-door-link"
import { Section } from "@/components/site/section"
import { buttonVariants } from "@/components/ui/button"
import { art } from "@/content/art"
import { hero, profile } from "@/content/site"
import { cn } from "@/lib/utils"

const HeroScene = lazy(() => import("@/components/scene/hero-scene"))

const ease = [0.22, 1, 0.36, 1] as const
// Break the title after the comma so each half reads as one phrase.
const titleLines = hero.title.split(/(?<=，)/)

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  } catch {
    return false
  }
}

const noop = () => () => {}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const doorLink = useDoorLink()
  const reduceMotion = useReducedMotion()
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => false)
  const onScreen = useInView(ref)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const fallback = <StaticScene />

  return (
    <Section id="home">
      <div
        ref={ref}
        className="relative min-h-svh overflow-hidden bg-linear-to-b from-[#6fa9df] via-[#a9cdec] to-[#e4efe9] mask-[linear-gradient(to_bottom,black_93%,transparent)]"
      >
        {webgl && !reduceMotion ? (
          <Suspense fallback={fallback}>
            <HeroScene
              progress={scrollYProgress}
              eventSource={ref}
              active={onScreen}
            />
          </Suspense>
        ) : (
          fallback
        )}

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="pointer-events-none relative z-10 mx-auto flex max-w-6xl flex-col gap-7 px-5 pt-8 pb-[42svh] md:px-8 md:pt-10 md:pb-[18svh]"
        >
          <header className="pointer-events-auto flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-lg font-bold tracking-widest text-ink">
              <CastleIcon className="size-5" />
              {profile.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/55 px-3 py-1 text-sm text-ink/80 ring-1 ring-white/70 backdrop-blur">
              <MapPinIcon className="size-3.5" />
              {profile.location}
            </span>
          </header>

          <div className="pointer-events-auto flex max-w-xl flex-col gap-6 pt-[3svh] md:pt-[6svh]">
            <motion.p
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm tracking-wider text-ink/80 md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              {hero.identity.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#e0a13a]">✦</span>}
                  {item}
                </span>
              ))}
            </motion.p>

            <h1
              aria-label={hero.title}
              className="text-4xl leading-tight font-bold tracking-wide text-ink [text-shadow:0_1px_0_rgb(255_255_255/0.6),0_0_28px_rgb(255_255_255/0.75)] md:text-[3.4rem] md:leading-[1.2]"
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
              className="rounded-2xl bg-white/45 p-4 text-base leading-8 text-ink ring-1 ring-white/60 backdrop-blur-md md:text-[1.05rem]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease }}
            >
              {hero.intro}
            </motion.p>

            <motion.div
              className="relative rounded-2xl bg-paper/90 p-4 pl-5 text-sm leading-7 text-ink shadow-[0_10px_30px_-12px_rgb(40_50_80/0.35)] ring-1 ring-paper-edge md:text-base md:leading-8"
              initial={{ opacity: 0, y: 12, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: -0.6 }}
              transition={{ duration: 0.9, delay: 1.35, ease }}
            >
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-door-hearth">
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
                    i > 0 && "bg-white/70 backdrop-blur"
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

// The same composition as the 3D scene, as plain images. Shown while the
// scene loads, without WebGL, and for visitors who prefer reduced motion.
function StaticScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <img
        src={art.landscape.src}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <img
        src={art.castle.src}
        alt=""
        className="absolute bottom-[4svh] left-1/2 w-[min(78vw,22rem)] -translate-x-1/2 md:right-[8%] md:bottom-[10svh] md:left-auto md:w-[min(34vw,30rem)] md:translate-x-0"
      />
    </div>
  )
}
