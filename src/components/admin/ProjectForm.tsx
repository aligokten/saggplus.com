"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ImagePlus, Trash2, X } from "lucide-react";
import type { Project } from "@/lib/projects";

const CATEGORY_OPTIONS = [
  "Mimari Proje",
  "İç Mekan Tasarımı",
  "Akustik Rapor",
  "Anahtar Teslim İnşaat",
  "Tadilat",
  "UI/UX Design",
];

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(project);

  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/projects/upload", { method: "POST", body: data });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error ?? "Yükleme başarısız.");
        setImages((prev) => [...prev, result.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      title: String(data.get("title") ?? ""),
      category: String(data.get("category") ?? ""),
      location: String(data.get("location") ?? ""),
      year: String(data.get("year") ?? ""),
      summary: String(data.get("summary") ?? ""),
      description: String(data.get("description") ?? ""),
      images,
      published: data.get("published") === "on",
    };

    try {
      const res = await fetch(
        isEdit ? `/api/projects/${project!.id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Kaydedilemedi.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!project) return;
    if (!confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Proje Başlığı" name="title" defaultValue={project?.title} required />
        <label className="block text-xs font-medium text-ink-muted">
          Kategori
          <input
            name="category"
            list="category-options"
            defaultValue={project?.category}
            className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <datalist id="category-options">
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <Field label="Konum" name="location" defaultValue={project?.location} />
        <Field label="Yıl" name="year" defaultValue={project?.year} />
      </div>

      <Field
        label="Kısa Özet (kart görünümünde gösterilir)"
        name="summary"
        defaultValue={project?.summary}
        textarea
        rows={2}
      />

      <Field
        label="Detaylı Açıklama (modal görünümünde gösterilir)"
        name="description"
        defaultValue={project?.description}
        textarea
        rows={5}
      />

      <div>
        <p className="text-xs font-medium text-ink-muted mb-2">Görseller</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <IconBtn onClick={() => moveImage(i, -1)} disabled={i === 0} label="Sola taşı">
                  <ArrowUp size={14} />
                </IconBtn>
                <IconBtn onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} label="Sağa taşı">
                  <ArrowDown size={14} />
                </IconBtn>
                <IconBtn onClick={() => removeImage(i)} label="Kaldır" danger>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
              {i === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium">
                  Kapak
                </span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-1.5 text-ink-muted hover:text-ink hover:border-white/40 transition-colors disabled:opacity-60"
          >
            <ImagePlus size={20} />
            <span className="text-xs">{uploading ? "Yükleniyor..." : "Görsel Ekle"}</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published !== 0}
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
            <X size={15} /> Projeyi Sil
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
  textarea,
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const cls =
    "mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";
  return (
    <label className="block text-xs font-medium text-ink-muted">
      {label}
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={rows} className={cls} />
      ) : (
        <input name={name} defaultValue={defaultValue} required={required} className={cls} />
      )}
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-full transition-colors disabled:opacity-30 ${
        danger ? "bg-red-500/80 hover:bg-red-500" : "bg-white/15 hover:bg-white/25"
      }`}
    >
      {children}
    </button>
  );
}
