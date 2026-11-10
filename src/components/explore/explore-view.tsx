import { useProgress } from "@react-three/drei"
import {
  BookOpenTextIcon,
  CastleIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { lazy, Suspense, useEffect, useState } from "react"

import { DialFace } from "@/components/magic/dial-face"
import { Button } from "@/components/ui/button"
import { art } from "@/content/art"
import { hero, profile, sections } from "@/content/site"
import { useWorldStore } from "@/stores/world-store"

import { PlacePanel } from "./place-panel"

const WorldScene = lazy(() => import("@/components/world/world-scene"))

const ease = [0.22, 1, 0.36, 1] as const

const doorFor = (target: string) =>
  sections.find((section) => section.id === target)?.door ?? null

// The castle on its island, to walk around and open doors in.
export function ExploreView() {
  const intro = useWorldStore((state) => state.intro)
  const focus = useWorldStore((state) => state.focus)
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#d4e9f3]">
      <Suspense fallback={null}>
        <WorldScene />
      </Suspense>
      <Loading />
      <TopBar />
      <AnimatePresence>{intro && <IntroCard key="intro" />}</AnimatePresence>
      {!intro && !focus && <Hint />}
      <WorldDial />
      <PlacePanel />
    </div>
  )
}

function Loading() {
  const { active, progress } = useProgress()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setReady(true), 400)
      return () => clearTimeout(timer)
    }
  }, [active, progress])
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-paper"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={art.dial.src}
            alt=""
            className="size-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm tracking-widest text-muted-foreground">
            城堡正在走过来 · {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TopBar() {
  const intro = useWorldStore((state) => state.intro)
  const setMode = useWorldStore((state) => state.setMode)
  const setFocus = useWorldStore((state) => state.setFocus)
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 md:p-6">
      <AnimatePresence>
        {!intro && (
          <motion.button
            type="button"
            onClick={() => {
              setFocus(null)
              useWorldStore.setState({ intro: true })
            }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-paper/85 px-3.5 py-2 text-sm font-bold tracking-widest text-ink shadow-sm ring-1 ring-paper-edge backdrop-blur"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <CastleIcon className="size-4" />
            {profile.name}
            <span className="font-normal text-muted-foreground">
              {hero.identity[0]}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <Button
        variant="outline"
        onClick={() => setMode("read")}
        className="pointer-events-auto ml-auto h-9 rounded-full bg-paper/85 px-3.5 backdrop-blur"
      >
        <BookOpenTextIcon data-icon="inline-start" />
        阅读模式
      </Button>
    </header>
  )
}

// The opening title card: who this is, and two ways in.
function IntroCard() {
  const dismissIntro = useWorldStore((state) => state.dismissIntro)
  const setFocus = useWorldStore((state) => state.setFocus)
  const setMode = useWorldStore((state) => state.setMode)
  return (
    <motion.section
      aria-labelledby="intro-title"
      className="absolute inset-x-3 bottom-3 z-30 max-h-[62svh] overflow-y-auto rounded-[1.75rem] bg-paper/92 p-5 shadow-[0_24px_60px_-24px_rgb(20_30_60/0.55)] ring-1 ring-paper-edge backdrop-blur-md md:inset-x-auto md:top-24 md:bottom-auto md:left-6 md:max-h-none md:w-[30rem] md:p-7"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      transition={{ duration: 0.9, ease, delay: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] paper-grain opacity-25 mix-blend-multiply" />
      <div className="relative flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm tracking-wider text-ink/75">
          {hero.identity.map((item, i) => (
            <span key={item} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-gold">✦</span>}
              {item}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-ink/60">
            <MapPinIcon className="size-3.5" />
            {profile.location}
          </span>
        </p>
        <h1
          id="intro-title"
          className="text-[1.7rem] leading-snug font-bold tracking-wide text-ink md:text-[2.1rem]"
        >
          {hero.title.split(/(?<=，)/).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="leading-7 text-ink/90">{hero.intro}</p>
        <p className="rounded-2xl bg-secondary/80 p-3.5 text-sm leading-7 text-ink ring-1 ring-paper-edge">
          <span className="mb-0.5 flex items-center gap-1.5 text-xs font-bold tracking-widest text-door-hearth">
            <SparklesIcon className="size-3.5" />
            正在寻找
          </span>
          {hero.intent}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button onClick={dismissIntro} className="h-10 rounded-full px-5">
            走进城堡的岛
          </Button>
          {hero.actions.map((action) => {
            const door = doorFor(action.target)
            return door ? (
              <Button
                key={action.target}
                variant="outline"
                onClick={() => setFocus(door)}
                className="h-10 rounded-full bg-paper px-4"
              >
                {action.label}
              </Button>
            ) : null
          })}
          <Button
            variant="ghost"
            onClick={() => setMode("read")}
            className="h-10 rounded-full px-3 text-muted-foreground"
          >
            直接阅读全文
          </Button>
        </div>
      </div>
    </motion.section>
  )
}

function Hint() {
  const [shown, setShown] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShown(false), 9000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <AnimatePresence>
      {shown && (
        <motion.p
          className="pointer-events-none absolute inset-x-0 top-20 z-20 mx-auto w-fit rounded-full bg-ink/70 px-4 py-2 text-center text-sm text-paper backdrop-blur md:top-auto md:bottom-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          拖动环顾，滚轮或双指缩放，点击发光的灯笼开门
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function WorldDial() {
  const focus = useWorldStore((state) => state.focus)
  const intro = useWorldStore((state) => state.intro)
  const setFocus = useWorldStore((state) => state.setFocus)
  return (
    <nav
      aria-label="城堡之门"
      className="absolute right-3 bottom-3 z-30 data-[hidden=true]:max-md:hidden md:right-auto md:bottom-6 md:left-6"
      // On phones the intro card and the open page need the whole width.
      data-hidden={focus !== null || intro}
    >
      <DialFace
        active={focus}
        className="size-20 md:size-28"
        link={(door) => ({
          href: `#${door.target}`,
          "aria-label": `${door.name}之门，前往${door.label}`,
          onClick: (event) => {
            event.preventDefault()
            setFocus(focus === door.id ? null : door.id)
          },
        })}
        hint={(door) => `${door.name} · ${door.label}`}
      />
    </nav>
  )
}
