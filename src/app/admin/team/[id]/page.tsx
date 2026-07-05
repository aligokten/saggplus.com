import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import TeamForm from "@/components/admin/TeamForm";
import { getTeamMember } from "@/lib/team";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) notFound();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Ekip Üyesini Düzenle</h1>
      <TeamForm member={member} />
    </AdminShell>
  );
}
