"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, MessageSquare, LogOut, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin", label: "Projeler", icon: LayoutGrid },
  { href: "/admin/messages", label: "Mesajlar", icon: MessageSquare },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-5 flex lg:flex-col gap-2">
        <Link href="/" className="text-lg font-bold tracking-tight mb-4 hidden lg:block">
          SAGG<span className="text-accent">+</span> Panel
        </Link>

        <nav className="flex lg:flex-col gap-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-ink"
                    : "text-ink-muted hover:bg-white/5 hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex lg:flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Siteyi Görüntüle</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 sm:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
