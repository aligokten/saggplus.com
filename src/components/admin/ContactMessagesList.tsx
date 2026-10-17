"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Trash2 } from "lucide-react";
import type { ContactSubmission } from "@/lib/contact";

export default function ContactMessagesList({
  submissions,
}: {
  submissions: ContactSubmission[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(submissions);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(submission: ContactSubmission) {
    if (
      !confirm(
        `"${submission.name}" adlı kişinin mesajını silmek istediğinize emin misiniz?`
      )
    )
      return;
    setBusyId(submission.id);
    const res = await fetch(`/api/admin/messages/${submission.id}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!res.ok) {
      alert("Mesaj silinemedi. Oturumunuzun süresi dolmuş olabilir.");
      return;
    }
    setItems((prev) => prev.filter((s) => s.id !== submission.id));
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">Henüz mesaj yok.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((s) => (
        <div key={s.id} className="rounded-2xl glass p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{s.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-ink-muted">
                {new Date(s.created_at).toLocaleString("tr-TR")}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(s)}
                disabled={busyId === s.id}
                aria-label="Mesajı Sil"
                className="grid h-9 w-9 place-items-center rounded-full text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-muted">
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-1.5 hover:text-accent"
            >
              <Mail size={13} /> {s.email}
            </a>

            {s.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={13} /> {s.phone}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
            {s.message}
          </p>
        </div>
      ))}
    </div>
  );
}
