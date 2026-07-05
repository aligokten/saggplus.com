import AdminShell from "@/components/admin/AdminShell";
import TeamList from "@/components/admin/TeamList";
import { listTeamMembers } from "@/lib/team";

export const dynamic = "force-dynamic";

export default function AdminTeamPage() {
  const members = listTeamMembers();
  return (
    <AdminShell>
      <TeamList members={members} />
    </AdminShell>
  );
}
