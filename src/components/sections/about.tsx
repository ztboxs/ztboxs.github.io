import { motion } from "motion/react"
import { useState } from "react"

import { Calcifer } from "@/components/magic/calcifer"
import { Reveal, revealMotion } from "@/components/magic/reveal"
import { Section } from "@/components/site/section"
import { ornaments } from "@/content/art"
import { about, collaboration, workMethods } from "@/content/site"

const numerals = ["壹", "贰", "叁", "肆"]

export function About() {
  // Hovering a working method feeds the hearth.
  const [fed, setFed] = useState<number | null>(null)

  return (
    <Section
      id="about"
      title="关于我"
      kicker="by the hearth"
      ornament={ornaments.teacup}
    >
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-16 px-5 md:px-8">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-3xl bg-paper shadow-[0_24px_60px_-28px_rgb(70_40_20/0.5)] ring-1 ring-paper-edge md:grid-cols-[1fr_16rem]">
            <div className="pointer-events-none absolute inset-0 paper-grain opacity-25 mix-blend-multiply" />
            <div className="relative flex flex-col gap-4 p-6 text-base leading-8 md:p-10 md:text-lg md:leading-9">
              {about.paragraphs.map((paragraph, i) => (
                <p
                  key={paragraph}
                  className={
                    i === 0 ? "text-xl font-bold md:text-2xl" : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#5a3424,#241718_70%)] px-8 pt-10 pb-6 md:rounded-r-3xl">
              <div className="absolute inset-x-6 bottom-0 h-6 rounded-t-full bg-[#120c0c]/70" />
              <Calcifer
                intensity={fed === null ? 0 : (fed + 1) / workMethods.length}
                className="w-36 md:w-44"
              />
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <h3 className="text-2xl font-bold tracking-wide [text-shadow:0_0_20px_rgb(255_255_255/0.6)]">
              工作方式
            </h3>
          </Reveal>
          <ol className="grid gap-5 sm:grid-cols-2">
            {workMethods.map((method, i) => (
              <motion.li
                key={method.title}
                {...revealMotion(i * 0.08)}
                onHoverStart={() => setFed(i)}
                onHoverEnd={() => setFed(null)}
                className="relative flex h-full gap-4 overflow-hidden rounded-2xl bg-paper p-5 shadow-[0_14px_30px_-20px_rgb(70_40_20/0.6)] ring-1 ring-paper-edge transition-shadow hover:shadow-[0_18px_40px_-16px_rgb(240_140_60/0.55)] md:p-6"
              >
                <span className="text-4xl leading-none font-bold text-door-hearth">
                  {numerals[i]}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-lg font-bold">{method.title}</h4>
                  <p className="leading-7 text-ink/85">{method.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <Reveal>
          <figure className="relative overflow-hidden rounded-3xl bg-paper p-6 shadow-[0_24px_60px_-28px_rgb(70_40_20/0.5)] ring-1 ring-paper-edge md:p-10">
            <div className="pointer-events-none absolute inset-0 paper-grain opacity-25 mix-blend-multiply" />
            <h3 className="relative mb-4 text-2xl font-bold tracking-wide">
              协作方式
            </h3>
            <blockquote className="relative flex flex-col gap-4 border-l-2 border-door-hearth/70 pl-5 text-base leading-8 md:text-lg md:leading-9">
              {collaboration.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </Section>
  )
}
