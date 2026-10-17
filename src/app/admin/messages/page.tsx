import AdminShell from "@/components/admin/AdminShell";
import ContactMessagesList from "@/components/admin/ContactMessagesList";
import InternshipApplicationsList from "@/components/admin/InternshipApplicationsList";
import { listContactSubmissions } from "@/lib/contact";
import { listInternshipApplications } from "@/lib/internship";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  const submissions = listContactSubmissions();
  const applications = listInternshipApplications();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold">Mesajlar</h1>

      <p className="mt-1 text-sm text-ink-muted">
        İletişim formundan gelen {submissions.length} mesaj ve staj formundan
        gelen {applications.length} başvuru burada listelenir.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">İletişim Mesajları</h2>

        <div className="mt-4">
          <ContactMessagesList submissions={submissions} />
        </div>
      </section>

      <section id="staj-basvurulari" className="mt-10">
        <h2 className="text-lg font-semibold">Staj Başvuruları</h2>

        <div className="mt-4">
          <InternshipApplicationsList applications={applications} />
        </div>
      </section>
    </AdminShell>
  );
}
