"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import Logo from "./Logo";

export default function Header({
  announcementEnabled = false,
}: {
  announcementEnabled?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-all duration-300 ${
        announcementEnabled ? "top-9" : "top-0"
      } ${scrolled ? "py-3" : "py-5"}`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 ${
            scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
          }`}
        >
          <a href="#top" onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#iletisim"
            className="hidden md:inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors"
          >
            Teklif Al
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-ink p-2 -mr-2"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mt-2 rounded-2xl glass-strong px-6 py-6 flex flex-col gap-5"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink-muted hover:text-ink transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#iletisim"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-[#171717]"
            >
              Teklif Al
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
