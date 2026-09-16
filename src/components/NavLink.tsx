"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Link for in-page section anchors such as `/#iletisim`.
 *
 * Clicking an anchor whose hash already matches the address bar is a no-op for
 * both the browser and the router, so once the URL carries `#iletisim` the
 * visitor can scroll away and that menu item stops responding. Handle the
 * scroll ourselves whenever the target lives on the current page, and keep the
 * address bar in sync without pushing a history entry.
 */
export default function NavLink({
  href,
  className,
  onNavigate,
  children,
}: {
  href: string;
  className?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const targetPath = path || "/";

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (!hash || pathname !== targetPath) return;

        const el = document.getElementById(hash);
        if (!el) return;

        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", href);
      }}
    >
      {children}
    </Link>
  );
}
