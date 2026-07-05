import { Mail, MapPin, ExternalLink } from "lucide-react";
import { company, ventures, nav } from "@/lib/content";
import FooterMap from "./FooterMap";
import InstagramIcon from "./icons/InstagramIcon";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <FooterMap />
      <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/60 via-[#171717]/85 to-[#171717]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <a href="#top">
              <Logo />
            </a>
            <p className="mt-4 max-w-sm text-sm text-ink-muted">
              {company.shortDescription}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail size={16} className="text-accent" /> {company.email}
              </a>
              <div className="flex items-start gap-2 text-ink-muted">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                {company.address}
              </div>
              <a
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <InstagramIcon size={16} className="text-accent" /> Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Sayfalar
            </h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Girişimlerimiz
            </h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {ventures.map((v) => (
                <li key={v.url}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 hover:text-accent transition-colors"
                    title={v.description}
                  >
                    {v.name}
                    <ExternalLink
                      size={13}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ink-muted">
          <p>
            &copy; {new Date().getFullYear()} {company.legalName}. Tüm hakları
            saklıdır.
          </p>
          <a href="/admin/login" className="hover:text-ink-muted/80 transition-colors">
            Yönetim Paneli
          </a>
        </div>
      </div>
    </footer>
  );
}
