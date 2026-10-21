import {
  CheckIcon,
  CopyIcon,
  FolderGit2Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { FallingStars } from "@/components/magic/falling-stars"
import { Reveal } from "@/components/magic/reveal"
import { Section } from "@/components/site/section"
import { Button } from "@/components/ui/button"
import { contact, profile } from "@/content/site"

const burst = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2
  return { x: Math.cos(angle) * 34, y: Math.sin(angle) * 34 }
})

export function Contact() {
  return (
    <Section
      id="contact"
      title={contact.title}
      kicker="under the stars"
      tone="night"
      className="dark pb-40 text-foreground md:pb-48"
    >
      <FallingStars />
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <div className="grid gap-8 overflow-hidden rounded-3xl bg-paper p-6 ring-1 ring-paper-edge backdrop-blur-md md:grid-cols-[1.3fr_1fr] md:gap-12 md:p-10">
            <div className="flex flex-col gap-4 text-base leading-8 md:text-lg md:leading-9">
              {contact.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="flex flex-col gap-3">
              <ContactRow icon={MailIcon} label="邮箱">
                <a
                  href={`mailto:${profile.email}`}
                  className="underline-offset-4 hover:text-gold hover:underline"
                >
                  {profile.email}
                </a>
              </ContactRow>
              <ContactRow icon={MessageCircleIcon} label="微信">
                <span className="flex items-center gap-2">
                  {profile.wechat}
                  <CopyWechat />
                </span>
              </ContactRow>
              <ContactRow icon={FolderGit2Icon} label="GitHub">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-gold hover:underline"
                >
                  github.com/ztboxs
                </a>
              </ContactRow>
              <ContactRow icon={MapPinIcon} label="所在地">
                {profile.location}
              </ContactRow>
            </ul>
          </div>
        </Reveal>
        <p className="mt-16 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
      </div>
    </Section>
  )
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MailIcon
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 ring-1 ring-paper-edge">
      <Icon className="size-4 shrink-0 text-gold" />
      <span className="w-14 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 break-all">{children}</span>
    </li>
  )
}

function CopyWechat() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.wechat)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <span className="relative inline-flex">
      <Button
        variant="ghost"
        size="xs"
        onClick={copy}
        aria-label={copied ? "已复制微信号" : "复制微信号"}
        className="text-muted-foreground"
      >
        {copied ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        {copied ? "已复制" : "复制"}
      </Button>
      <AnimatePresence>
        {copied &&
          burst.map((spark, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 size-1 rounded-full bg-[#fff3c4] shadow-[0_0_6px_2px_#ffd56b]"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: spark.x, y: spark.y, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>
    </span>
  )
}
