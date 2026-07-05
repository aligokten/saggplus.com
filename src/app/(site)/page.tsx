import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { listProjects } from "@/lib/projects";
import { listServices } from "@/lib/services";
import { listTeamMembers } from "@/lib/team";
import { getSettings } from "@/lib/settings";

// Projects/services/team/settings are managed live via the admin panel, so
// this page must not be statically cached at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  const projects = listProjects({ onlyPublished: true });
  const services = listServices({ onlyPublished: true });
  const team = listTeamMembers({ onlyPublished: true });
  const settings = getSettings();
  const announcementEnabled =
    Boolean(settings.announcement_enabled) && Boolean(settings.announcement_text);

  return (
    <>
      <main className="flex-1">
        <Hero heroImage={settings.hero_image} announcementEnabled={announcementEnabled} />
        <Services services={services} />
        <Projects projects={projects} />
        <About team={team} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
