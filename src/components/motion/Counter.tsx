"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const format = (v: number, suffix: string) => `${Math.round(v).toLocaleString("tr-TR")}${suffix}`;

/** Ekrana girince 0'dan hedef sayıya kadar sayan rakam. */
export default function Counter({
  to,
  duration = 1.8,
  suffix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!inView) {
      if (!reduce) el.textContent = format(0, suffix);
      return;
    }
    if (reduce) {
      el.textContent = format(to, suffix);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration, suffix]);

  // İlk HTML'de son değer durur (JS'siz ziyaretçi ve arama motorları için);
  // ekrana girince 0'dan yeniden sayılır.
  return (
    <span ref={ref} className="tabular-nums">
      {format(to, suffix)}
    </span>
  );
}
