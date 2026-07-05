"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, GraduationCap, CheckCircle2 } from "lucide-react";

const INTERNSHIP_TYPES = ["Ofis Stajı", "Şantiye Stajı"];

type Status = "idle" | "loading" | "success" | "error";

export default function InternshipApplication() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [internshipType, setInternshipType] = useState(INTERNSHIP_TYPES[0]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setStatus("idle");
    setErrorMsg("");
    setInternshipType(INTERNSHIP_TYPES[0]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      full_name: String(data.get("full_name") ?? ""),
      school: String(data.get("school") ?? ""),
      department: String(data.get("department") ?? ""),
      term: String(data.get("term") ?? ""),
      internship_type: internshipType,
      required_duration: String(data.get("required_duration") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      notes: String(data.get("notes") ?? ""),
      website: String(data.get("website") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error ?? "Bir şeyler ters gitti, tekrar deneyin.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-accent transition-colors text-left"
      >
        Staj Başvurusu
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              className="absolute inset-0 bg-[#171717]/70 backdrop-blur-xl"
              onClick={close}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-label="Staj Başvurusu"
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong shadow-2xl shadow-black/50 p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Kapat"
                className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-ink hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-8 pr-6"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                      <CheckCircle2 size={24} strokeWidth={1.75} />
                    </div>
                    <p className="mt-6 text-base sm:text-lg leading-relaxed">
                      Staj başvurunuz alınmıştır, CV ve portfolyonuzu{" "}
                      <a
                        href="mailto:info@saggplus.com"
                        className="text-accent hover:underline"
                      >
                        info@saggplus.com
                      </a>{" "}
                      adresine gönderebilirsiniz.
                      <br />
                      Sizinle en kısa süre içerisinde iletişime geçeceğiz.
                      <br />
                      Bizimle iletişime geçtiğiniz için teşekkürler.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    <div className="flex items-center gap-3 pr-8">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
                        <GraduationCap size={20} strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Staj Başvurusu</h3>
                        <p className="text-xs text-ink-muted">
                          Formu doldurun, en kısa sürede size dönüş yapalım.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Adı Soyadı" name="full_name" required />
                      <Field label="Okul Adı" name="school" required />
                      <Field label="Bölüm Adı" name="department" required />
                      <Field
                        label="Bitirilen Dönem"
                        name="term"
                        required
                        placeholder="Ör. 3. Sınıf / 2. Dönem"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium text-ink-muted mb-2">
                        Staj Türü
                      </p>
                      <div className="flex gap-2">
                        {INTERNSHIP_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setInternshipType(type)}
                            className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm transition-colors ${
                              internshipType === type
                                ? "border-accent bg-accent/15 text-accent"
                                : "border-white/10 text-ink-muted hover:text-ink hover:border-white/30"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Zorunlu Staj Süresi"
                        name="required_duration"
                        required
                        placeholder="Ör. 20 iş günü"
                      />
                      <Field label="E-posta" name="email" type="email" required />
                      <Field label="Telefon" name="phone" type="tel" />
                    </div>

                    <label className="mt-4 block text-xs font-medium text-ink-muted">
                      Eklemek İstedikleriniz
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </label>

                    {/* honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60"
                    >
                      {status === "loading" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    </button>

                    {status === "error" && (
                      <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-medium text-ink-muted">
      {label}
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
