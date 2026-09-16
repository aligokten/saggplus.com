import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";
import { listProjects } from "@/lib/projects";

// Projects are managed live via the admin panel, so this page must not be
// statically cached at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projeler | SAGG+",
  description:
    "SAGG+ tarafından hayata geçirilen mimari proje, iç mekan tasarımı, akustik rapor ve anahtar teslim inşaat projelerinin tamamı.",
};

export default function ProjectsPage() {
  const projects = listProjects({ onlyPublished: true });

  return (
    <>
      <main className="flex-1">
        <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Projeler"
              title="Hayata geçirdiğimiz işler"
            />
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Mimari proje, iç mekan tasarımı, akustik mühendislik ve anahtar
              teslim inşaat alanlarında tamamladığımız {projects.length} proje.
            </p>

            <div className="mt-12">
              {projects.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  Henüz yayınlanmış proje yok.
                </p>
              ) : (
                <ProjectGrid projects={projects} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
