"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Phone, Trash2 } from "lucide-react";
import type {
  InternshipApplicationRecord,
  InternshipStatus,
} from "@/lib/internship";

const STATUS_LABELS: Record<InternshipStatus, string> = {
  beklemede: "Beklemede",
  iletisime_gecildi: "İletişime Geçildi",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
};

const STATUS_STYLES: Record<InternshipStatus, string> = {
  beklemede: "bg-white/10 text-ink-muted",
  iletisime_gecildi: "bg-blue-400/15 text-blue-300",
  onaylandi: "bg-emerald-400/15 text-emerald-300",
  reddedildi: "bg-red-400/15 text-red-300",
};

export default function InternshipApplicationsList({
  applications,
}: {
  applications: InternshipApplicationRecord[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(applications);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: InternshipStatus) {
    setBusyId(id);
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/internship/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(application: InternshipApplicationRecord) {
    if (
      !confirm(
        `"${application.full_name}" adlı kişinin staj başvurusunu silmek istediğinize emin misiniz?`
      )
    )
      return;
    setBusyId(application.id);
    await fetch(`/api/internship/${application.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((a) => a.id !== application.id));
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">Henüz staj başvurusu yok.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((application) => (
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

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <select
              value={application.status}
              disabled={busyId === application.id}
              onChange={(e) =>
                handleStatusChange(
                  application.id,
                  e.target.value as InternshipStatus
                )
              }
              className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 ${STATUS_STYLES[application.status]}`}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#171717] text-ink">
                  {label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleDelete(application)}
              disabled={busyId === application.id}
              aria-label="Başvuruyu Sil"
              className="grid h-9 w-9 place-items-center rounded-full text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
