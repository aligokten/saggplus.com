"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { company } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import InstagramIcon from "./icons/InstagramIcon";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
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
    <section id="iletisim" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="İletişim" title="Projenizi konuşalım" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 glass rounded-3xl p-8 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold">{company.legalName}</h3>
              <p className="mt-1 text-sm text-ink-muted">{company.shortDescription}</p>
            </div>

            <a
              href={`mailto:${company.email}`}
              className="flex items-start gap-3 text-sm hover:text-accent transition-colors"
            >
              <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
              {company.email}
            </a>

            <div className="flex items-start gap-3 text-sm">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              {company.address}
            </div>

            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm hover:text-accent transition-colors"
            >
              <InstagramIcon size={18} className="mt-0.5 shrink-0 text-accent" />
              Instagram&apos;da takip edin
            </a>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass rounded-3xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Ad Soyad" name="name" required />
              <Field label="E-posta" name="email" type="email" required />
              <Field label="Telefon" name="phone" />
              <Field label="Konu" name="subject" placeholder="Ör. Mimari proje talebi" />
            </div>

            <label className="mt-5 block text-xs font-medium text-ink-muted">
              Mesajınız
              <textarea
                name="message"
                required
                rows={5}
                className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Projeniz hakkında bize bilgi verin..."
              />
            </label>

            {/* honeypot — hidden from real users, bots tend to fill it */}
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
              className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors disabled:opacity-60"
            >
              {status === "loading" ? (
                "Gönderiliyor..."
              ) : (
                <>
                  <Send size={16} /> Gönder
                </>
              )}
            </button>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-sm text-accent-3"
              >
                <CheckCircle2 size={16} /> Mesajınız alındı, en kısa sürede dönüş
                yapacağız.
              </motion.p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
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
