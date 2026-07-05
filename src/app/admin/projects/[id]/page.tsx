import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProject } from "@/lib/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Projeyi Düzenle</h1>
      <ProjectForm project={project} />
    </AdminShell>
  );
}
