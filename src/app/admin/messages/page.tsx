import AdminShell from "@/components/admin/AdminShell";
import { listContactSubmissions } from "@/lib/contact";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  const submissions = listContactSubmissions();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold">Mesajlar</h1>
      <p className="mt-1 text-sm text-ink-muted">
        İletişim formundan gelen {submissions.length} mesaj. E-posta gönderimi
        henüz etkin değil — mesajlar yalnızca burada listelenir.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {submissions.length === 0 && (
          <p className="text-sm text-ink-muted">Henüz mesaj yok.</p>
        )}
        {submissions.map((s) => (
          <div key={s.id} className="rounded-2xl glass p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-ink-muted">
                {new Date(s.created_at).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-muted">
              <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 hover:text-accent">
                <Mail size={13} /> {s.email}
              </a>
              {s.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} /> {s.phone}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{s.message}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
