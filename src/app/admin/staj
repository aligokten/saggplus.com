import AdminShell from "@/components/admin/AdminShell";
import { listInternshipApplications } from "@/lib/internship";
import { GraduationCap, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InternshipApplicationsPage() {
  const applications = listInternshipApplications();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold">Staj Başvuruları</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Staj başvuru formundan gelen {applications.length} başvuru. Başvurular
        yalnızca burada listelenir.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {applications.length === 0 && (
          <p className="text-sm text-ink-muted">Henüz staj başvurusu yok.</p>
        )}

        {applications.map((application) => (
          <div key={application.id} className="rounded-2xl glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{application.full_name}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {application.school} · {application.department}
                </p>
              </div>

              <p className="text-xs text-ink-muted">
                {new Date(application.created_at).toLocaleString("tr-TR")}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-ink-muted">
                <GraduationCap size={13} /> {application.internship_type}
              </span>

              <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-ink-muted">
                {application.term}
              </span>

              <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-ink-muted">
                {application.required_duration}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-muted">
              <a
                href={`mailto:${application.email}`}
                className="flex items-center gap-1.5 hover:text-accent"
              >
                <Mail size={13} /> {application.email}
              </a>

              {application.phone && (
                <a
                  href={`tel:${application.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-1.5 hover:text-accent"
                >
                  <Phone size={13} /> {application.phone}
                </a>
              )}
            </div>

            {application.notes && (
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                {application.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
