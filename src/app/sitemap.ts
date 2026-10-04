import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Sitemap istek anında üretilir; proje/hizmet içeriği admin panelinden değişir.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Proje detayları şu an modal içinde açılıyor (ayrı URL yok). /projeler/[slug]
  // sayfaları eklendiğinde buraya listProjects() ile eklenmeli.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projeler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
