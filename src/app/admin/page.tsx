import AdminShell from "@/components/admin/AdminShell";
import ProjectsList from "@/components/admin/ProjectsList";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const projects = listProjects();
  return (
    <AdminShell>
      <ProjectsList projects={projects} />
    </AdminShell>
  );
}
