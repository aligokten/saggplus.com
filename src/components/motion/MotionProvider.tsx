"use client";

import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

/**
 * Site genelinde animasyon ayarları. "Hareketi azalt" tercihi açık olan
 * ziyaretçilerde dönüşüm (kayma, ölçek) animasyonları kapanır, yalnızca
 * opaklık geçişleri kalır.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}

/** Sayfanın üstünde, kaydırma ilerlemesini gösteren ince turuncu çizgi. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
    />
  );
}
