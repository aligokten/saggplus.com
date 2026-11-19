"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.65, 0, 0.35, 1] as const;

// Modern, düz çatılı villa kesiti: konsol üst kat, yan blok, ölçü çizgileri.
const MAIN_LINES = [
  "M24 400 H616", // zemin
  "M80 400 V250 H380 V400", // zemin kat
  "M180 250 V170 H430 V250 H380", // konsol üst kat
  "M440 400 V300 H570 V400", // yan blok
  "M170 170 H440", // parapet
  "M430 300 H580", // yan blok saçak
];

const DETAIL_LINES = [
  "M110 400 V300 H170 V400", // kapı / doğrama
  "M210 360 H350 M210 290 H350 M210 290 V360 M280 290 V360 M350 290 V360", // zemin kat camları
  "M210 230 V190 H300 V230 Z M320 230 V190 H410 V230 Z", // üst kat camları
  "M465 370 V325 H545 V370 Z", // yan blok penceresi
  "M380 250 L430 250", // konsol alt hattı
];

const DIMENSION_LINES = [
  "M180 128 H430 M180 120 V136 M430 120 V136", // yatay ölçü
  "M604 170 V400 M596 170 H612 M596 400 H612", // düşey ölçü
  "M80 430 H570 M80 422 V438 M570 422 V438", // toplam genişlik
];

const CONSTRUCTION_LINES = [
  "M180 170 L380 400",
  "M430 170 L80 400",
  "M24 250 H616",
  "M24 170 H616",
];

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.3 + i * 0.18, duration: 1.4, ease: EASE },
      opacity: { delay: 0.3 + i * 0.18, duration: 0.2 },
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 6 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 2.2 + i * 0.12, duration: 0.6 },
  }),
};

/**
 * Hero arkasında kendi kendini çizen mimari teknik çizim. Önce yardımcı
 * (kesik) çizgiler, sonra yapı, detaylar ve ölçüler sırayla çizilir.
 */
export default function BlueprintDrawing({ className }: { className?: string }) {
  let order = 0;
  return (
    <motion.svg
      viewBox="0 0 664 470"
      fill="none"
      initial="hidden"
      animate="shown"
      aria-hidden="true"
      className={className}
    >
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 6" className="blueprint-dash">
        {CONSTRUCTION_LINES.map((d) => (
          <motion.path key={d} d={d} variants={draw} custom={order++ * 0.5} />
        ))}
      </g>

      <g stroke="var(--ink)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        {MAIN_LINES.map((d) => (
          <motion.path key={d} d={d} variants={draw} custom={order++} />
        ))}
      </g>

      <g stroke="rgba(245,247,251,0.55)" strokeWidth="1.2">
        {DETAIL_LINES.map((d) => (
          <motion.path key={d} d={d} variants={draw} custom={order++ * 0.7} />
        ))}
      </g>

      <g stroke="var(--accent)" strokeWidth="1.2">
        {DIMENSION_LINES.map((d) => (
          <motion.path key={d} d={d} variants={draw} custom={order++ * 0.6} />
        ))}
      </g>

      <g fill="var(--accent)" fontSize="13" fontFamily="var(--font-manrope), sans-serif" letterSpacing="1">
        <motion.text x="290" y="114" variants={fadeIn} custom={0}>12.40</motion.text>
        <motion.text x="612" y="292" variants={fadeIn} custom={1}>+6.80</motion.text>
        <motion.text x="300" y="458" variants={fadeIn} custom={2}>24.90</motion.text>
      </g>

      {/* Kuzey oku */}
      <motion.g variants={fadeIn} custom={3} stroke="var(--ink)" strokeWidth="1.2">
        <circle cx="560" cy="78" r="26" stroke="rgba(245,247,251,0.45)" />
        <path d="M560 58 L568 86 L560 80 L552 86 Z" fill="var(--accent)" stroke="none" />
        <text x="555" y="46" fill="var(--ink)" stroke="none" fontSize="12" fontFamily="var(--font-manrope), sans-serif">N</text>
      </motion.g>

      {/* Ölçü noktaları */}
      <motion.g variants={fadeIn} custom={4} fill="var(--accent)">
        {[
          [80, 250],
          [180, 170],
          [430, 170],
          [380, 400],
          [570, 300],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
        ))}
      </motion.g>
    </motion.svg>
  );
}
