"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Metni kelime kelime, her kelime kendi maskesinin altından yükselerek açar.
 * `mode="load"` sayfa açılınca, `mode="view"` ekrana girince oynar.
 */
export default function RevealText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  mode = "view",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  mode?: "load" | "view";
}) {
  const words = text.split(" ").filter(Boolean);
  const trigger =
    mode === "load"
      ? { animate: "shown" }
      : { whileInView: "shown", viewport: { once: true, margin: "-60px" } };

  return (
    <motion.span
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            variants={{
              hidden: { y: "110%", rotate: 4 },
              shown: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className={`inline-block origin-bottom-left ${wordClassName ?? ""}`}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}
