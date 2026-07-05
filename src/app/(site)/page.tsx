import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { listProjects } from "@/lib/projects";

// Projects are managed live via the admin panel, so this page must not be
// statically cached at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  const projects = listProjects({ onlyPublished: true });

  return (
    <>
      <main className="flex-1">
        <Hero />
        <Services />
        <Projects projects={projects} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
