import AdminShell from "@/components/admin/AdminShell";
import InternshipApplicationsList from "@/components/admin/InternshipApplicationsList";
import { listInternshipApplications } from "@/lib/internship";

export const dynamic = "force-dynamic";

export default function InternshipApplicationsPage() {
  const applications = listInternshipApplications();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold">Staj Başvuruları</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Staj başvuru formundan gelen {applications.length} başvuru.
      </p>

      <div className="mt-6">
        <InternshipApplicationsList applications={applications} />
      </div>
    </AdminShell>
  );
}
