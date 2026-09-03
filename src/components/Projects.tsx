"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import SectionHeading from "./SectionHeading";
import ProjectModal from "./ProjectModal";

export default function Projects({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 480);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  // Cards flow down 3 rows then wrap to the next column, so the track stays
  // roughly a third as wide. Fewer projects use fewer rows to avoid gaps.
  const rows = Math.min(3, projects.length);

  return (
    <section id="projeler" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-end justify-between gap-6">
        <SectionHeading eyebrow="Projeler" title="Hayata geçirdiğimiz işler" />

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="grid h-11 w-11 place-items-center rounded-full glass hover:bg-white/10 transition-colors"
            aria-label="Önceki projeler"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="grid h-11 w-11 place-items-center rounded-full glass hover:bg-white/10 transition-colors"
            aria-label="Sonraki projeler"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        className="mt-12 grid grid-flow-col auto-cols-[78vw] sm:auto-cols-[340px] gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-4 snap-x snap-mandatory"
      >
        {projects.map((project, i) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={() => setActive(project)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % rows) * 0.08 }}
            whileHover={{ y: -8 }}
            className="group relative flex h-full flex-col snap-start rounded-3xl glass overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
              {project.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-accent/20 to-accent-2/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 rounded-full glass-strong px-3 py-1 text-[11px] font-medium tracking-wide text-ink">
                {project.category}
              </div>
              <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full glass-strong opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-semibold text-ink line-clamp-1">
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">
                {project.summary}
              </p>
              <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-ink-muted">
                <span className="truncate">{project.location}</span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-ink-muted/50" />
                <span className="shrink-0">{project.year}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
