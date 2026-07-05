"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { ServiceRecord } from "@/lib/services";
import { SERVICE_ICONS, SERVICE_ICON_KEYS, DEFAULT_SERVICE_ICON } from "@/lib/serviceIcons";

export default function ServiceForm({ service }: { service?: ServiceRecord }) {
  const router = useRouter();
  const isEdit = Boolean(service);

  const [icon, setIcon] = useState(service?.icon ?? DEFAULT_SERVICE_ICON);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      icon,
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
      published: data.get("published") === "on",
    };

    try {
      const res = await fetch(
        isEdit ? `/api/services/${service!.id}` : "/api/services",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Kaydedilemedi.");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!service) return;
    if (!confirm(`"${service.title}" hizmetini silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    await fetch(`/api/services/${service.id}`, { method: "DELETE" });
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      <Field label="Hizmet Başlığı" name="title" defaultValue={service?.title} required />

      <label className="block text-xs font-medium text-ink-muted">
        Açıklama
        <textarea
          name="description"
          defaultValue={service?.description}
          rows={3}
          className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </label>

      <div>
        <p className="text-xs font-medium text-ink-muted mb-2">İkon</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SERVICE_ICON_KEYS.map((key) => {
            const Icon = SERVICE_ICONS[key];
            const active = icon === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                aria-label={key}
                className={`grid aspect-square place-items-center rounded-xl border transition-colors ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/10 text-ink-muted hover:text-ink hover:border-white/30"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={service?.published !== 0}
          className="h-4 w-4 rounded border-white/20 bg-white/5 accent-accent"
        />
        Sitede yayınla
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-60"
          >
            <X size={15} /> Hizmeti Sil
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-ink-muted">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
