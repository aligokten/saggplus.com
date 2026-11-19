"use client";

import { motion } from "framer-motion";
import RevealText from "./motion/RevealText";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <motion.span
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-60px" }}
        className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <motion.span
          variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="block h-px w-8 origin-left bg-accent"
        />
        <motion.span
          variants={{
            hidden: { opacity: 0, x: -8, letterSpacing: "0.5em" },
            shown: { opacity: 1, x: 0, letterSpacing: "0.2em" },
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {eyebrow}
        </motion.span>
      </motion.span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        <RevealText text={title} delay={0.15} />
      </h2>
    </div>
  );
}
