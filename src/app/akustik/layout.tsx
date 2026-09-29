import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş | SAGG Akustik Hesap Aracı",
  robots: { index: false, follow: false },
};

export default function AkustikLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
