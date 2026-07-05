import AdminShell from "@/components/admin/AdminShell";
import TeamForm from "@/components/admin/TeamForm";

export default function NewTeamMemberPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Yeni Ekip Üyesi</h1>
      <TeamForm />
    </AdminShell>
  );
}
