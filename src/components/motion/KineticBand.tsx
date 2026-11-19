"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

/**
 * Hizmet adlarından oluşan, sürekli kayan iri yazı bandı. Sayfa kaydırıldıkça
 * hızlanır ve kaydırma yönüne göre yön değiştirir.
 */
export default function KineticBand({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    // Eğik bant ekran kenarından taşmasın diye dış sarmalayıcı kırpıyor.
    <section aria-label="Hizmet alanlarımız" className="relative overflow-hidden py-6">
      <div className="-mx-8 -rotate-1 border-y border-white/10 bg-[#141414]/60 py-8 sm:py-12">
        <Row items={items} baseVelocity={-2.2} />
        <Row items={items} baseVelocity={2.2} faded />
      </div>
    </section>
  );
}

function Row({
  items,
  baseVelocity,
  faded = false,
}: {
  items: string[];
  baseVelocity: number;
  faded?: boolean;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  // İçerik 4 kez tekrarlanıyor; -25% ile 0 arasında sarmak kesintisiz döngü verir.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const text = items.join("  ✦  ") + "  ✦  ";

  return (
    <div className="flex whitespace-nowrap overflow-hidden" aria-hidden="true">
      <motion.div style={{ x }} className="flex shrink-0">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={`shrink-0 pr-6 text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight leading-[1.1] ${
              faded ? "text-ink/15" : "text-ink/90"
            }`}
          >
            {text.split("✦").map((part, j, arr) => (
              <span key={j}>
                {part}
                {j < arr.length - 1 && <span className="text-accent">✦</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
