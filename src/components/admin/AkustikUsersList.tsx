"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ban, Copy, KeyRound, Mail, Trash2, UserPlus } from "lucide-react";
import type { AkustikKind, AkustikStatus, AkustikUser } from "@/lib/akustik";

const STATUS_LABELS: Record<AkustikStatus, string> = {
  bekliyor: "İlk giriş bekleniyor",
  aktif: "Aktif",
  suresi_doldu: "Süresi doldu",
  iptal: "İptal edildi",
};

const STATUS_STYLES: Record<AkustikStatus, string> = {
  bekliyor: "bg-blue-400/15 text-blue-300",
  aktif: "bg-emerald-400/15 text-emerald-300",
  suresi_doldu: "bg-white/10 text-ink-muted",
  iptal: "bg-red-400/15 text-red-300",
};

const KIND_LABELS: Record<AkustikKind, string> = { demo: "Demo", tam: "Tam lisans" };

const inputClass =
  "mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString("tr-TR") : "—";
}

function remaining(iso: string | null): string {
  if (!iso) return "";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h} sa ${m} dk kaldı`;
}

function mailtoLink(email: string, password: string, kind: AkustikKind, demoHours: number) {
  const subject = "SAGG Akustik Hesap Aracı — giriş bilgileriniz";
  const sure =
    kind === "demo"
      ? `\nDemo hesabınız ilk girişinizden itibaren ${demoHours} saat geçerlidir; süre dolduğunda şifre otomatik olarak iptal edilir.\n`
      : "";
  const body =
    `Merhaba,\n\nSAGG Akustik Hesap Aracı'na aşağıdaki bilgilerle giriş yapabilirsiniz:\n\n` +
    `Adres: https://akustik.saggplus.com\nE-posta: ${email}\nŞifre: ${password}\n${sure}\n` +
    `Satın alma ve sorularınız için info@saggplus.com adresine yazabilirsiniz.\n\nSAGG+`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type Issued = { email: string; password: string; kind: AkustikKind };

export default function AkustikUsersList({
  users,
  demoHours,
}: {
  users: AkustikUser[];
  demoHours: number;
}) {
  const router = useRouter();
  const [items, setItems] = useState(users);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/akustik");
    if (res.ok) setItems(await res.json());
    router.refresh();
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setCreating(true);
    setError("");
    const res = await fetch("/api/admin/akustik", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        kind: data.get("kind"),
        note: data.get("note"),
      }),
    });
    const result = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      setError(result.error ?? "Hesap oluşturulamadı.");
      return;
    }
    form.reset();
    setCopied(false);
    setIssued({ email: result.user.email, password: result.password, kind: result.user.kind });
    await reload();
  }

  async function handleReset(user: AkustikUser) {
    if (!confirm(`${user.email} için yeni şifre üretilsin mi? Eski şifre hemen geçersiz olur.`)) return;
    setBusyId(user.id);
    setError("");
    const res = await fetch(`/api/admin/akustik/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sifre" }),
    });
    const result = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(result.error ?? "Şifre yenilenemedi.");
      return;
    }
    setCopied(false);
    setIssued({ email: user.email, password: result.password, kind: user.kind });
    await reload();
  }

  async function handleRevoke(user: AkustikUser) {
    if (!confirm(`${user.email} hesabı iptal edilsin mi? Kullanıcının oturumu hemen kapanır.`)) return;
    setBusyId(user.id);
    await fetch(`/api/admin/akustik/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "iptal" }),
    });
    setBusyId(null);
    await reload();
  }

  async function handleDelete(user: AkustikUser) {
    if (!confirm(`${user.email} kaydı silinsin mi? Silinen e-postaya yeniden hesap açılabilir.`)) return;
    setBusyId(user.id);
    await fetch(`/api/admin/akustik/${user.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((u) => u.id !== user.id));
    setBusyId(null);
    router.refresh();
  }

  async function handleCopy() {
    if (!issued) return;
    await navigator.clipboard.writeText(`E-posta: ${issued.email}\nŞifre: ${issued.password}`);
    setCopied(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="rounded-2xl glass p-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-ink-muted sm:col-span-2">
          E-posta
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="block text-xs font-medium text-ink-muted">
          Hesap türü
          <select name="kind" defaultValue="demo" className={inputClass}>
            <option value="demo">Demo ({demoHours} saat, ilk girişten itibaren)</option>
            <option value="tam">Tam lisans (süresiz)</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-ink-muted">
          Not (isteğe bağlı)
          <input name="note" maxLength={500} placeholder="Firma, telefon…" className={inputClass} />
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60"
          >
            <UserPlus size={16} />
            {creating ? "Oluşturuluyor..." : "Hesap oluştur"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </form>

      {issued && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <p className="text-sm font-medium">
            Şifre oluşturuldu. Bu şifre yalnızca şimdi gösterilir — kullanıcıya iletin.
          </p>
          <div className="mt-3 grid gap-1 text-sm font-mono">
            <span>E-posta: {issued.email}</span>
            <span>Şifre: {issued.password}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium hover:bg-white/20"
            >
              <Copy size={14} />
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
            <a
              href={mailtoLink(issued.email, issued.password, issued.kind, demoHours)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium hover:bg-white/20"
            >
              <Mail size={14} />
              E-posta taslağı aç
            </a>
            <button
              type="button"
              onClick={() => setIssued(null)}
              className="rounded-full px-4 py-2 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">Henüz akustik kullanıcısı yok.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((user) => {
            const open = user.status === "bekliyor" || user.status === "aktif";
            return (
              <div key={user.id} className="rounded-2xl glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    {user.note && <p className="mt-1 text-xs text-ink-muted">{user.note}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1">{KIND_LABELS[user.kind]}</span>
                    <span className={`rounded-full px-3 py-1 ${STATUS_STYLES[user.status]}`}>
                      {STATUS_LABELS[user.status]}
                    </span>
                  </div>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-ink-muted sm:grid-cols-2">
                  <div>Oluşturuldu: {fmt(user.created_at)}</div>
                  <div>İlk giriş: {fmt(user.first_login_at)}</div>
                  <div>Son giriş: {fmt(user.last_login_at)}</div>
                  {user.expires_at && (
                    <div>
                      Bitiş: {fmt(user.expires_at)}
                      {user.status === "aktif" && (
                        <span className="text-emerald-300"> · {remaining(user.expires_at)}</span>
                      )}
                    </div>
                  )}
                  {user.revoked_at && user.status === "iptal" && (
                    <div>İptal: {fmt(user.revoked_at)}</div>
                  )}
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {open && (
                    <>
                      <button
                        type="button"
                        disabled={busyId === user.id}
                        onClick={() => handleReset(user)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-ink-muted hover:bg-white/10 hover:text-ink disabled:opacity-50"
                      >
                        <KeyRound size={13} />
                        Yeni şifre
                      </button>
                      <button
                        type="button"
                        disabled={busyId === user.id}
                        onClick={() => handleRevoke(user)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-ink-muted hover:bg-red-400/15 hover:text-red-300 disabled:opacity-50"
                      >
                        <Ban size={13} />
                        İptal et
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={busyId === user.id}
                    onClick={() => handleDelete(user)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-ink-muted hover:bg-red-400/15 hover:text-red-300 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
