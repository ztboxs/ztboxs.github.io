import { motion, type HTMLMotionProps } from "motion/react"

// Content materialises out of a soft blur, like something conjured.
export const revealMotion = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 18, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }) as const

type RevealProps = HTMLMotionProps<"div"> & { delay?: number }

export function Reveal({ delay = 0, ...props }: RevealProps) {
  return <motion.div {...revealMotion(delay)} {...props} />
}
