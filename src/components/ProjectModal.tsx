"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/projects";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  if (project && project.id !== openProjectId) {
    setOpenProjectId(project.id);
    setIndex(0);
  }

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(project.images.length, 1));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + project.images.length) % Math.max(project.images.length, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  const images = project?.images ?? [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
        >
          {/* frosted backdrop over the rest of the landing page */}
          <motion.div
            className="absolute inset-0 bg-[#171717]/70 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong shadow-2xl shadow-black/50"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-ink hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-[16/10] bg-black/30 overflow-hidden rounded-t-3xl">
              <AnimatePresence mode="wait" initial={false}>
                {images.length > 0 ? (
                  <motion.img
                    key={index}
                    src={images[index]}
                    alt={`${project.title} görsel ${index + 1}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-2/20" />
                )}
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setIndex((i) => (i - 1 + images.length) % images.length)
                    }
                    aria-label="Önceki görsel"
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-ink hover:bg-black/65 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i + 1) % images.length)}
                    aria-label="Sonraki görsel"
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-ink hover:bg-black/65 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`${i + 1}. görsele git`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                  <span className="rounded-full glass px-3 py-1 font-medium text-accent">
                    {project.category}
                  </span>
                  <span>{project.location}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-muted/50" />
                  <span>{project.year}</span>
                </div>

                <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                  {project.title}
                </h3>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink-muted whitespace-pre-line">
                  {project.description || project.summary}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
