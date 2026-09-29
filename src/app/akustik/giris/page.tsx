"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AudioLines } from "lucide-react";

/** Yalnızca aynı sitedeki bir yola dönülür; açık yönlendirmeye izin verilmez. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/akustik/giris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(result.error ?? "Giriş başarısız.");
      setLoading(false);
      return;
    }

    // Hesap aracı Next.js dışında, statik bir uygulamadır: tam sayfa yüklenir.
    window.location.href = safeNext(searchParams.get("next"));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl glass p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <AudioLines size={22} />
        </div>
        <h1 className="mt-6 text-xl font-semibold">SAGG Akustik Hesap Aracı</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Size iletilen e-posta adresi ve şifre ile giriş yapın.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="block text-xs font-medium text-ink-muted">
            E-posta
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-xs font-medium text-ink-muted">
            Şifre
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-xs text-ink-muted">
          Demo hesapları ilk girişten itibaren 24 saat geçerlidir. Satın alma ve bilgi için{" "}
          <a href="mailto:info@saggplus.com" className="text-ink underline">
            info@saggplus.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AkustikLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
