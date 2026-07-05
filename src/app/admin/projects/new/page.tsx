import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Yeni Proje</h1>
      <ProjectForm />
    </AdminShell>
  );
}
