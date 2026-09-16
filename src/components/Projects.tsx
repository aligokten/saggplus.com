import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import SectionHeading from "./SectionHeading";
import ProjectGrid from "./ProjectGrid";

export default function Projects({
  projects,
  totalCount,
}: {
  projects: Project[];
  totalCount: number;
}) {
  if (projects.length === 0) return null;

  return (
    <section id="projeler" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Projeler" title="Hayata geçirdiğimiz işler" />

          <Link
            href="/projeler"
            className="group inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium text-ink hover:bg-white/10 transition-colors"
          >
            Tüm Projeler
            {totalCount > 0 && (
              <span className="text-ink-muted">({totalCount})</span>
            )}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </section>
  );
}
