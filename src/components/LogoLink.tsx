"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

/**
 * The logo always leads home. When the visitor is already on the homepage a
 * route change would be a no-op, so scroll back to the top instead of leaving
 * the click dead.
 */
export default function LogoLink({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label="Ana sayfa"
      onClick={(e) => {
        onNavigate?.();
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      <Logo className={className} />
    </Link>
  );
}
