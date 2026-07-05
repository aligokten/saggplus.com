"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import type { TeamMemberRecord } from "@/lib/team";

export default function TeamForm({ member }: { member?: TeamMemberRecord }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(member);

  const [photo, setPhoto] = useState(member?.photo ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "team");
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Yükleme başarısız.");
      setPhoto(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      title: String(data.get("title") ?? ""),
      photo,
      published: data.get("published") === "on",
    };

    try {
      const res = await fetch(isEdit ? `/api/team/${member!.id}` : "/api/team", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Kaydedilemedi.");
      router.push("/admin/team");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!member) return;
    if (!confirm(`"${member.name}" kişisini silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    await fetch(`/api/team/${member.id}`, { method: "DELETE" });
    router.push("/admin/team");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      <Field label="Ad Soyad" name="name" defaultValue={member?.name} required />
      <Field label="Unvan" name="title" defaultValue={member?.title} />

      <div>
        <p className="text-xs font-medium text-ink-muted mb-2">Fotoğraf</p>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 rounded-full overflow-hidden bg-white/5 border border-white/10">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm text-ink hover:bg-white/10 transition-colors disabled:opacity-60"
          >
            <ImagePlus size={16} />
            {uploading ? "Yükleniyor..." : photo ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
        <p className="mt-2 text-xs text-ink-muted">
          Fotoğraf yüklenmezse isim baş harfleriyle bir avatar gösterilir.
        </p>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={member?.published !== 0}
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
            <X size={15} /> Kişiyi Sil
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
