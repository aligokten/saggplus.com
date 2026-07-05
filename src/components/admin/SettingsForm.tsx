"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [heroImage, setHeroImage] = useState(settings.hero_image);
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    Boolean(settings.announcement_enabled)
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "site");
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Yükleme başarısız.");
      setHeroImage(result.url);
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
    setSaved(false);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      hero_image: heroImage,
      announcement_enabled: announcementEnabled,
      announcement_text: String(data.get("announcement_text") ?? ""),
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Kaydedilemedi.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl">
      <div>
        <h2 className="text-lg font-semibold">Hero Görseli</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Anasayfanın en üstündeki başlık bölümünde arkaplan fotoğrafı olarak kullanılır.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-20 w-28 shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm text-ink hover:bg-white/10 transition-colors disabled:opacity-60"
          >
            <ImagePlus size={16} />
            {uploading ? "Yükleniyor..." : "Görseli Değiştir"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-lg font-semibold">Duyuru Şeridi</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Sitenin en üstünde kayan yazı olarak gösterilir (örn. bayram kutlaması, özel duyuru).
        </p>

        <label className="mt-4 flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={announcementEnabled}
            onChange={(e) => setAnnouncementEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-accent"
          />
          Duyuru şeridini göster
        </label>

        <label className="mt-4 block text-xs font-medium text-ink-muted">
          Duyuru Metni
          <input
            name="announcement_text"
            defaultValue={settings.announcement_text}
            placeholder="Ör. 29 Ekim Cumhuriyet Bayramımız kutlu olsun!"
            className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-accent-3">Ayarlar kaydedildi.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60 self-start"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
